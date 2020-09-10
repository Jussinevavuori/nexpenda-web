import { computed, Computed } from "easy-peasy";
import { Transaction } from "./transactions.class";
import { MoneyAmount } from "../../utils/MoneyAmount";
import { groupByDate } from "../../utils/groupByDate";
import { StoreModel } from "../../store";
import { compareDate } from "../../utils/compareDate";

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

  /**
   * Sums of filtered transactions
   */
  sums: Computed<
    FilteredTransactionsModel,
    {
      all: MoneyAmount;
      expenses: MoneyAmount;
      incomes: MoneyAmount;
    },
    StoreModel
  >;
}

export const filteredTransactionsModel: FilteredTransactionsModel = {
  items: computed(
    [
      (_, storeState) => storeState.transactions.items,
      (_, storeState) => storeState.interval.startDate,
      (_, storeState) => storeState.interval.endDate,
    ],
    (items, startDate, endDate) => {
      return items.filter((item) => {
        if (compareDate(item.date, "<", startDate)) return false;
        if (compareDate(item.date, ">", endDate)) return false;
        return true;
      });
    }
  ),

  itemsByDates: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      return groupByDate(items, (_) => _.date, { sort: true });
    }
  ),

  count: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      return items.length;
    }
  ),

  sums: computed(
    [(_, storeState) => storeState.transactions.filtered.items],
    (items) => {
      const incomes = items
        .filter((_) => _.amount.isPositive)
        .reduce((sum, item) => sum + item.amount.value, 0);
      const expenses = items
        .filter((_) => _.amount.isNegative)
        .reduce((sum, item) => sum + item.amount.value, 0);
      return {
        all: new MoneyAmount(incomes + expenses),
        incomes: new MoneyAmount(incomes),
        expenses: new MoneyAmount(expenses),
      };
    }
  ),
};
