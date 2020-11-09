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
import { JsonTransaction, Transaction } from "../classes/Transaction";
import { TransactionService } from "../services/TransactionService";
import { StoreModel } from "../store";
import { MoneyAmount } from "../classes/MoneyAmount";
import {
  filteredTransactionsModel,
  FilteredTransactionsModel,
} from "./transactions.filtered.model";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { DeleteTransactionEvent } from "../history/DeleteTransactionEvent";
import { DeleteTransactionsEvent } from "../history/DeleteTransactionsEvent";

export interface TransactionsModel {
  /**
   * All user's current transactions
   */
  items: Transaction[];

  /**
   * Has the user loaded the transactions
   */
  initialized: boolean;

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
   * Filtered properties (copies of the above properties using only
   * filtered items)
   */
  filtered: FilteredTransactionsModel;

  /**
   * All different categories
   */
  categories: Computed<TransactionsModel, string[]>;

  /**
   * Minimum possible amount
   */
  minimumAmount: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Maximum possible amount
   */
  maximumAmount: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Fetch all transactions for user from server
   */
  getTransactions: Thunk<
    TransactionsModel,
    void,
    any,
    StoreModel,
    ReturnType<typeof TransactionService["getTransactions"]>
  >;

  /**
   * Action called by get transaction thunk to update get result to state
   */
  _getTransactions: Action<TransactionsModel, JsonTransaction[]>;

  /**
   * Post transaction to state
   */
  postTransaction: Thunk<
    TransactionsModel,
    Parameters<typeof TransactionService["postTransaction"]>[0],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["postTransaction"]>
  >;

  /**
   * Post and multiple transactions to state
   */
  postTransactions: Thunk<
    TransactionsModel,
    Parameters<typeof TransactionService["postTransactions"]>[0],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["postTransactions"]>
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
    StoreModel,
    ReturnType<typeof TransactionService["deleteTransaction"]>
  >;

  /**
   * Delete and remove multiple transactions from state
   */
  deleteTransactions: Thunk<
    TransactionsModel,
    string[],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["deleteTransactions"]>
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
    Parameters<typeof TransactionService["putTransaction"]>[0],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["putTransaction"]>
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
    Parameters<typeof TransactionService["patchTransaction"]>[0],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["patchTransaction"]>
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

  initialized: false,

  itemsByDates: computed((state) => {
    return DateUtils.groupByDate(state.items, (_) => _.date, { sort: true });
  }),

  count: computed((state) => state.items.length),

  filtered: filteredTransactionsModel,

  categories: computed((state) =>
    state.items.map((_) => _.category).filter((c, i, a) => a.indexOf(c) === i)
  ),

  minimumAmount: computed((state) => {
    return state.items.reduce((min, next) => {
      return next.amount.value < min.value ? next.amount : min;
    }, new MoneyAmount(0));
  }),

  maximumAmount: computed((state) => {
    return state.items.reduce((max, next) => {
      return next.amount.value > max.value ? next.amount : max;
    }, new MoneyAmount(0));
  }),

  getTransactions: thunk(async (actions, payload) => {
    const result = await TransactionService.getTransactions();
    if (result.isSuccess()) {
      actions._getTransactions(result.value);
    }
    return result;
  }),

  _getTransactions: action((state, jsons) => {
    state.items = jsons.map((json) => new Transaction(json));
    state.initialized = true;
  }),

  postTransaction: thunk(async (actions, json) => {
    const result = await TransactionService.postTransaction(json);
    if (result.isSuccess()) {
      actions._postTransaction(result.value);
    }
    return result;
  }),

  postTransactions: thunk(async (actions, jsons) => {
    const result = await TransactionService.postTransactions(jsons);
    if (result.isSuccess()) {
      result.value.forEach((transaction) => {
        actions._postTransaction(transaction);
      });
    }
    return result;
  }),

  _postTransaction: action((state, json) => {
    state.items.push(new Transaction(json));
  }),

  deleteTransaction: thunk(
    async (actions, id, { getState, getStoreActions }) => {
      // Get transaction and ensure one exists
      const transaction = getState().items.find((_) => _.id === id);

      // Delete the transaction
      actions._deleteTransaction(id);
      const result = await TransactionService.deleteTransaction(id);

      // If deletion succeeds, create deletion event
      if (result.isSuccess() && transaction) {
        getStoreActions().history.pushEvent(
          new DeleteTransactionEvent(transaction)
        );
      }

      // If deletion fails, put transaction back
      else if (result.isFailure() && transaction) {
        actions._putTransaction(transaction?.toJson());
      }
      return result;
    }
  ),

  deleteTransactions: thunk(
    async (actions, ids, { getState, getStoreActions }) => {
      // Get the transactions
      const transactions = getState().items.filter((_) => {
        return ids.includes(_.id);
      });

      // Delete the transactions from the state
      transactions.forEach((transaction) => {
        actions._deleteTransaction(transaction.id);
      });
      const result = await TransactionService.deleteTransactions(
        transactions.map((_) => _.id)
      );

      // If deletion succeeds, create mass deletion event
      if (result.isSuccess()) {
        getStoreActions().history.pushEvent(
          new DeleteTransactionsEvent(transactions)
        );
      }

      // If deletion fails, put transaction back
      else if (result.isFailure()) {
        transactions.forEach((transaction) => {
          actions._putTransaction(transaction.toJson());
        });
      }
      return result;
    }
  ),

  _deleteTransaction: action((state, id) => {
    state.items = state.items.filter((item) => item.id !== id);
  }),

  putTransaction: thunk(async (actions, json) => {
    const result = await TransactionService.putTransaction(json);
    if (result.isSuccess()) {
      actions._putTransaction(result.value);
    }
    return result;
  }),

  _putTransaction: action((state, json) => {
    const exists = state.items.find((_) => _.id === json.id);
    if (exists) {
      state.items = state.items.map((item) =>
        item.id === json.id ? new Transaction(json) : item
      );
    } else {
      state.items.push(new Transaction(json));
    }
  }),

  patchTransaction: thunk(async (actions, json) => {
    const result = await TransactionService.patchTransaction(json);
    if (result.isSuccess()) {
      actions._patchTransaction(result.value);
    }
    return result;
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
