import { Action, action, Computed, computed, Thunk, thunk } from "easy-peasy";
import { Transaction } from "./transactions.class";
import {
  TransactionConstructable,
  isTransactionConstructableArray,
} from "./transactions.constructable";
import { TransactionService } from "../../services/TransactionService";

const transactionService = new TransactionService();

export interface TransactionsModel {
  /**
   * Current transactions
   */
  items: Transaction[];

  /**
   * Current amount of transactions
   */
  count: Computed<TransactionsModel, number>;

  /**
   * Fetch all transactions for user from server
   */
  getTransactions: Thunk<TransactionsModel, void>;

  /**
   * Create a transaction from a transaction constructable
   */
  createTransaction: Action<TransactionsModel, TransactionConstructable>;

  /**
   * Create multiple transactions from a transaction constructable
   */
  createTransactions: Action<TransactionsModel, TransactionConstructable[]>;

  /**
   * Removes a single transaction by its ID
   */
  removeTransaction: Action<TransactionsModel, string>;

  /**
   * Update a signle transaction (transaction constructable argument must contain ID)
   */
  updateTransaction: Action<TransactionsModel, TransactionConstructable>;
}

export const transactionsModel: TransactionsModel = {
  items: [],

  count: computed((state) => state.items.length),

  getTransactions: thunk(async (actions) => {
    const result = await transactionService.getTransactions();
    if (isTransactionConstructableArray(result.data)) {
      actions.createTransactions(result.data);
    }
  }),

  createTransaction: action((state, constructable) => {
    state.items.push(new Transaction(constructable));
  }),

  createTransactions: action((state, constructables) => {
    state.items.push(...constructables.map((_) => new Transaction(_)));
  }),

  removeTransaction: action((state, id) => {
    state.items = state.items.filter((_) => _.id !== id);
  }),

  updateTransaction: action((state, constructable) => {
    state.items = state.items.map((_) => {
      return _.id === constructable.id ? new Transaction(constructable) : _;
    });
  }),
};
