import { computed, Computed } from "easy-peasy";
import { Transaction } from "../classes/Transaction";
import { StoreModel } from "../store";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { DataUtils } from "../utils/DataUtils/DataUtils";
import { lightFormat } from "date-fns";

export interface FilteredTransactionsModel {
  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

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
  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  items: computed(
    [
      (_, storeState) => storeState.transactions.items,
      (_, storeState) => storeState.interval,
      (_, storeState) => storeState.filters,
    ],
    (items, interval, filters) => {
      return items.filter((item) => {
        // Filter by start date
        if (DateUtils.compareDate(item.date, "<", interval.startDate)) {
          return false;
        }

        // Filter by end date
        if (DateUtils.compareDate(item.date, ">", interval.endDate)) {
          return false;
        }

        // Filter by search term
        if (
          filters.searchTerm &&
          !DataUtils.textSearch(
            filters.searchTerm,
            ...[
              item.amount.format(),
              item.category.value,
              item.comment,
              lightFormat(item.date, "d.M.yyyy"),
            ]
          )
        ) {
          return false;
        }

        // Filter by minimum amount
        if (item.amount.value < filters.minAmount) {
          return false;
        }

        // Filter by maximum amount
        if (item.amount.value > filters.maxAmount) {
          return false;
        }

        // Filter by hidden IDs
        if (filters.hiddenIds.includes(item.id)) {
          return false;
        }

        // Filter by category (if categories filter activated)
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(item.category.id)
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
