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
import { groupByDate } from "../../utils/groupByDate";
import { MoneyAmount } from "../../utils/MoneyAmount";
import {
  filteredTransactionsModel,
  FilteredTransactionsModel,
} from "./transactions.filtered.model";

/**
 * Instance of transactionService for thunks
 */
const transactionService = new TransactionService();

export interface TransactionsModel {
  /**
   * All user's current transactions
   */
  items: Transaction[];

  /**
   * Current transactions grouped and sorted by dates
   */
  itemsByDates: Computed<
    TransactionsModel,
    { date: Date; items: Transaction[] }[]
  >;

  /**
   * Current amount of transactions
   */
  count: Computed<TransactionsModel, number>;

  /**
   * Sum of transactions
   */
  sums: Computed<
    TransactionsModel,
    {
      all: MoneyAmount;
      expenses: MoneyAmount;
      incomes: MoneyAmount;
    }
  >;

  /**
   * Filtered properties (copies of the above properties using only
   * filtered items)
   */
  filtered: FilteredTransactionsModel;

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
  items: [],

  itemsByDates: computed((state) => {
    return groupByDate(state.items, (_) => _.date, { sort: true });
  }),

  count: computed((state) => state.items.length),

  sums: computed((state) => {
    const incomes = state.items
      .filter((_) => _.amount.integer > 0)
      .reduce((sum, item) => sum + item.amount.integer, 0);
    const expenses = state.items
      .filter((_) => _.amount.integer < 0)
      .reduce((sum, item) => sum + item.amount.integer, 0);
    return {
      all: new MoneyAmount(incomes + expenses),
      incomes: new MoneyAmount(incomes),
      expenses: new MoneyAmount(expenses),
    };
  }),

  filtered: filteredTransactionsModel,

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
