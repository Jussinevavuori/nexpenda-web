import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";
import { Transaction } from "./transactions.class";
import { JsonTransaction } from "./transactions.json";
import { TransactionService } from "../../services/TransactionService";
import { StoreModel } from "../../store";
import { compareDate } from "../../utils/compareDate";
import { groupByDate } from "../../utils/groupByDate";
import { intervalModel, IntervalModel } from "../interval/interval.model";
import { MoneyAmount } from "../../utils/MoneyAmount";

/**
 * Instance of transactionService for thunks
 */
const transactionService = new TransactionService();

export interface TransactionsModel {
  /**
   * Current interval filter (nested model)
   */
  interval: IntervalModel;

  /**
   * All user's current transactions
   */
  items: Transaction[];

  /**
   * Current transactions which pass all the filters:
   *
   * - Interval filter (time must be between the interval startDate and endDate)
   */
  filteredItems: Computed<TransactionsModel, Transaction[], StoreModel>;

  /**
   * Current transactions grouped and sorted by dates
   */
  itemsByDates: Computed<
    TransactionsModel,
    { date: Date; items: Transaction[] }[]
  >;

  /**
   * Current filtered transactions grouped and sorted by dates
   */
  filteredItemsByDates: Computed<
    TransactionsModel,
    { date: Date; items: Transaction[] }[],
    StoreModel
  >;

  /**
   * Current amount of transactions
   */
  count: Computed<TransactionsModel, number>;

  /**
   * Current amount of transactions after filtering
   */
  filteredCount: Computed<TransactionsModel, number>;

  /**
   * Sum of transactions
   */
  sum: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Sum of filtered transactions
   */
  filteredSum: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Sum of positive transactions only
   */
  incomesSum: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Sum of negative transactions only
   */
  expensesSum: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Sum of positive filtered transactions only
   */
  filteredIncomesSum: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Sum of negative filtered transactions only
   */
  filteredExpensesSum: Computed<TransactionsModel, MoneyAmount>;

  /**
   * All different categories
   */
  categories: Computed<TransactionsModel, string[]>;

  /**
   * Fetch all transactions for user from server
   */
  getTransactions: Thunk<
    TransactionsModel,
    void,
    any,
    any,
    Promise<JsonTransaction[]>
  >;

  /**
   * Action called by get transaction thunk to update get result to state
   */
  _getTransactions: Action<TransactionsModel, JsonTransaction[]>;

  /**
   * Post and update transaction to state
   */
  postTransaction: Thunk<
    TransactionsModel,
    Omit<JsonTransaction, "id" | "uid">,
    any,
    any,
    Promise<JsonTransaction>
  >;

  /**
   * Action called by post transaction thunk to update post result to state
   */
  _postTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Delete and remove transaction from state
   */
  deleteTransaction: Thunk<
    TransactionsModel,
    string,
    any,
    any,
    Promise<Boolean>
  >;

  /**
   * Action called by delete transaction thunk to update delete result to state
   */
  _deleteTransaction: Action<TransactionsModel, string>;

  /**
   * Put and update transaction to state
   */
  putTransaction: Thunk<
    TransactionsModel,
    JsonTransaction,
    any,
    any,
    Promise<JsonTransaction>
  >;

  /**
   * Action called by put transaction thunk to update put result to state
   */
  _putTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Patch and update transaction to state
   */
  patchTransaction: Thunk<
    TransactionsModel,
    JsonTransaction,
    any,
    any,
    Promise<JsonTransaction>
  >;

  /**
   * Action called by patch transaction thunk to update patch result to state
   */
  _patchTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Listening to auth changes
   */
  onAuthChanged: ThunkOn<TransactionsModel, any, StoreModel>;

  _clearTransactions: Action<TransactionsModel, void>;
}

export const transactionsModel: TransactionsModel = {
  interval: intervalModel,

  items: [],

  filteredItems: computed((state) => {
    return state.items.filter((item) => {
      if (compareDate(item.date, "<", state.interval.startDate)) return false;
      if (compareDate(item.date, ">", state.interval.endDate)) return false;
      return true;
    });
  }),

  itemsByDates: computed((state) => {
    return groupByDate(state.items, (_) => _.date, { sort: true });
  }),

  filteredItemsByDates: computed((state) => {
    return groupByDate(state.filteredItems, (_) => _.date, { sort: true });
  }),

  count: computed((state) => state.items.length),

  filteredCount: computed((state) => state.filteredItems.length),

  sum: computed((state) => {
    return MoneyAmount.sum(state.items.map((_) => _.amount));
  }),

  filteredSum: computed((state) => {
    return MoneyAmount.sum(state.filteredItems.map((_) => _.amount));
  }),

  incomesSum: computed((state) => {
    return MoneyAmount.sum(
      state.items.filter((_) => _.amount.isPositive).map((_) => _.amount)
    );
  }),

  filteredIncomesSum: computed((state) => {
    return MoneyAmount.sum(
      state.filteredItems
        .filter((_) => _.amount.isPositive)
        .map((_) => _.amount)
    );
  }),

  expensesSum: computed((state) => {
    return MoneyAmount.sum(
      state.items.filter((_) => _.amount.isNegative).map((_) => _.amount)
    );
  }),

  filteredExpensesSum: computed((state) => {
    return MoneyAmount.sum(
      state.filteredItems
        .filter((_) => _.amount.isNegative)
        .map((_) => _.amount)
    );
  }),

  categories: computed((state) =>
    state.items.map((_) => _.category).filter((c, i, a) => a.indexOf(c) === i)
  ),

  getTransactions: thunk(async (actions) => {
    const transactions = await transactionService.getTransactions();
    actions._getTransactions(transactions);
    return transactions;
  }),

  _getTransactions: action((state, jsons) => {
    state.items = jsons.map((json) => new Transaction(json));
  }),

  postTransaction: thunk(async (actions, json) => {
    const transaction = await transactionService.postTransaction(json);
    actions._postTransaction(transaction);
    return transaction;
  }),

  _postTransaction: action((state, json) => {
    state.items.push(new Transaction(json));
  }),

  deleteTransaction: thunk(async (actions, id) => {
    const deleted = await transactionService.deleteTransaction(id);
    actions._deleteTransaction(id);
    return deleted;
  }),

  _deleteTransaction: action((state, id) => {
    state.items = state.items.filter((item) => item.id !== id);
  }),

  putTransaction: thunk(async (actions, json) => {
    const transaction = await transactionService.putTransaction(json);
    actions._putTransaction(transaction);
    return transaction;
  }),

  _putTransaction: action((state, json) => {
    state.items = state.items.map((item) =>
      item.id === json.id ? new Transaction(json) : item
    );
  }),

  patchTransaction: thunk(async (actions, json) => {
    const transaction = await transactionService.patchTransaction(json);
    actions._patchTransaction(transaction);
    return transaction;
  }),

  _patchTransaction: action((state, json) => {
    state.items = state.items.map((item) =>
      item.id === json.id ? new Transaction(json) : item
    );
  }),

  onAuthChanged: thunkOn(
    (_, store) => [store.auth.logout, store.auth._login],
    (actions, target) => {
      const [loggedOut, loggedIn] = target.resolvedTargets;
      switch (target.type) {
        case loggedOut:
          actions._clearTransactions();
          break;
        case loggedIn:
          actions.getTransactions();
          break;
      }
    }
  ),

  _clearTransactions: action((state) => {
    state.items = [];
  }),
};
