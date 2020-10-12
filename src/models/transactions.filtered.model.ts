import { computed, Computed } from "easy-peasy";
import { Transaction } from "../classes/Transaction";
import { StoreModel } from "../store";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { DataUtils } from "../utils/DataUtils/DataUtils";
import { lightFormat } from "date-fns";

export interface FilteredTransactionsModel {
  /**
   * All user's current transactions after filterign
   */
  items: Computed<FilteredTransactionsModel, Transaction[], StoreModel>;

  /**
   * Filtered transactions grouped and sorted by dates
   */
  itemsByDates: Computed<
    FilteredTransactionsModel,
    { date: Date; items: Transaction[] }[],
    StoreModel
  >;

  /**
   * Filtered amount of transactions
   */
  count: Computed<FilteredTransactionsModel, number, StoreModel>;
}

export const filteredTransactionsModel: FilteredTransactionsModel = {
  items: computed(
    [
      (_, storeState) => storeState.transactions.items,
      (_, storeState) => storeState.interval.startDate,
      (_, storeState) => storeState.interval.endDate,
      (_, storeState) => storeState.filters.searchTerm,
      (_, storeState) => storeState.filters.minAmount,
      (_, storeState) => storeState.filters.maxAmount,
      (_, storeState) => storeState.filters.categories,
      (_, storeState) => storeState.filters.hiddenIds,
    ],
    (
      items,
      startDate,
      endDate,
      searchTerm,
      minAmount,
      maxAmount,
      categories,
      hiddenIds
    ) => {
      return items.filter((item) => {
        // Filter by hidden
        if (hiddenIds.includes(item.id)) {
          return false;
        }

        // Filter by start date
        if (DateUtils.compareDate(item.date, "<", startDate)) {
          return false;
        }

        // Filter by end date
        if (DateUtils.compareDate(item.date, ">", endDate)) {
          return false;
        }

        // Filter by minimum amount
        if (item.amount.value < minAmount) {
          return false;
        }

        // Filter by maximum amount
        if (item.amount.value > maxAmount) {
          return false;
        }

        // Filter by category (if categories filter activated)
        if (categories.length > 0 && !categories.includes(item.category)) {
          return false;
        }

        // Filter by search term
        if (
          searchTerm &&
          !DataUtils.textSearch(
            searchTerm,
            ...[
              item.amount.format(),
              item.category,
              item.comment,
              lightFormat(item.date, "d.M.yyyy"),
            ]
          )
        ) {
          return false;
        }

        // All filters passed: include
        return true;
      });
    }
  ),

  itemsByDates: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      return DateUtils.groupByDate(items, (_) => _.date, { sort: true });
    }
  ),

  count: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      return items.length;
    }
  ),
};
