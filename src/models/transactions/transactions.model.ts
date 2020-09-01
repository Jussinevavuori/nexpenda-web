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
import { JsonTransaction, isJsonTransactionArray } from "./transactions.json";
import { TransactionService } from "../../services/TransactionService";
import { isServerError, ServerError } from "../../utils/ServerError";
import { StoreModel } from "../../store";
import { compareDate } from "../../utils/compareDate";
import { groupByDate } from "../../utils/groupByDate";
import { intervalModel, IntervalModel } from "../interval/interval.model";
import { MoneyAmount } from "../../utils/MoneyAmount";

const transactionService = new TransactionService();

export interface TransactionsModel {
  /**
   * Current interval (nested model)
   */
  interval: IntervalModel;

  /**
   * Current transactions
   */
  items: Transaction[];

  /**
   * Current transactions, filtered
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
    Promise<void | ServerError>
  >;
  _getTransactions: Action<TransactionsModel, JsonTransaction[]>;

  /**
   * Post and update transaction to state
   */
  postTransaction: Thunk<
    TransactionsModel,
    Omit<JsonTransaction, "id" | "uid">,
    any,
    any,
    Promise<void | ServerError>
  >;
  _postTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Delete and remove transaction from state
   */
  deleteTransaction: Thunk<
    TransactionsModel,
    string,
    any,
    any,
    Promise<void | ServerError>
  >;
  _deleteTransaction: Action<TransactionsModel, string>;

  /**
   * Put and update transaction to state
   */
  putTransaction: Thunk<
    TransactionsModel,
    JsonTransaction,
    any,
    any,
    Promise<void | ServerError>
  >;
  _putTransaction: Action<TransactionsModel, JsonTransaction>;

  /**
   * Patch and update transaction to state
   */
  patchTransaction: Thunk<
    TransactionsModel,
    JsonTransaction,
    any,
    any,
    Promise<void | ServerError>
  >;
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
    return new MoneyAmount(
      state.items.reduce((sum, item) => sum + item.amount.integer, 0)
    );
  }),

  filteredSum: computed((state) => {
    return new MoneyAmount(
      state.filteredItems.reduce((sum, item) => sum + item.amount.integer, 0)
    );
  }),

  incomesSum: computed((state) => {
    return new MoneyAmount(
      state.items
        .filter((_) => _.amount.integer > 0)
        .reduce((sum, item) => sum + item.amount.integer, 0)
    );
  }),

  filteredIncomesSum: computed((state) => {
    return new MoneyAmount(
      state.filteredItems
        .filter((_) => _.amount.integer > 0)
        .reduce((sum, item) => sum + item.amount.integer, 0)
    );
  }),

  expensesSum: computed((state) => {
    return new MoneyAmount(
      state.items
        .filter((_) => _.amount.integer < 0)
        .reduce((sum, item) => sum + item.amount.integer, 0)
    );
  }),

  filteredExpensesSum: computed((state) => {
    return new MoneyAmount(
      state.filteredItems
        .filter((_) => _.amount.integer < 0)
        .reduce((sum, item) => sum + item.amount.integer, 0)
    );
  }),

  categories: computed((state) =>
    state.items.map((_) => _.category).filter((c, i, a) => a.indexOf(c) === i)
  ),

  getTransactions: thunk(async (actions) => {
    const { data } = await transactionService.getTransactions();
    if (isServerError(data)) {
      return data;
    } else if (isJsonTransactionArray(data)) {
      actions._getTransactions(data);
    }
  }),

  _getTransactions: action((state, jsons) => {
    state.items = jsons.map((json) => new Transaction(json));
  }),

  postTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.postTransaction(json);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._postTransaction(data);
    }
  }),

  _postTransaction: action((state, json) => {
    state.items.push(new Transaction(json));
  }),

  deleteTransaction: thunk(async (actions, id) => {
    const { data } = await transactionService.deleteTransaction(id);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._deleteTransaction(id);
    }
  }),

  _deleteTransaction: action((state, id) => {
    state.items = state.items.filter((item) => item.id !== id);
  }),

  putTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.putTransaction(json);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._putTransaction(data);
    }
  }),

  _putTransaction: action((state, json) => {
    state.items = state.items.map((item) =>
      item.id === json.id ? new Transaction(json) : item
    );
  }),

  patchTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.putTransaction(json);
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._patchTransaction(data);
    }
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
