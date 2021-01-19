import { computed, Computed } from "easy-peasy";
import { Transaction } from "../classes/Transaction";
import { StoreModel } from "../store";
import { DateUtils } from "../utils/DateUtils/DateUtils";

export interface SelectedTransactionsModel {
  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  /**
   * All user's current transactions after filtering by date
   */
  items: Computed<SelectedTransactionsModel, Transaction[], StoreModel>;

  /**
   * Selected transactions grouped and sorted by dates
   */
  itemsByDates: Computed<
    SelectedTransactionsModel,
    { date: Date; items: Transaction[] }[],
    StoreModel
  >;

  /**
   * Filtered amount of transactions
   */
  count: Computed<SelectedTransactionsModel, number, StoreModel>;
}

export const selectedTransactionsModel: SelectedTransactionsModel = {
  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  items: computed(
    [
      (_, storeState) => storeState.transactions.items,
      (_, storeState) => storeState.interval.startDate,
      (_, storeState) => storeState.interval.endDate,
    ],
    (items, startDate, endDate) => {
      return items.filter((item) => {
        if (DateUtils.compareDate(item.date, "<", startDate)) {
          return false;
        } else if (DateUtils.compareDate(item.date, ">", endDate)) {
          return false;
        } else {
          return true;
        }
      });
    }
  ),

  itemsByDates: computed(
    [(_, storeState) => storeState.transactions.selected.items],
    (items) => {
      return DateUtils.groupByDate(items, (_) => _.date, { sort: true });
    }
  ),

  count: computed(
    [(_, storeState) => storeState.transactions.selected.items],
    (items) => {
      return items.length;
    }
  ),
};
