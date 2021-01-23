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
import { Transaction } from "../classes/Transaction";
import { TransactionService } from "../services/TransactionService";
import { StoreModel } from "../store";
import { DateUtils } from "../utils/DateUtils/DateUtils";
import { DeleteTransactionEvent } from "../history/DeleteTransactionEvent";
import { DeleteTransactionsEvent } from "../history/DeleteTransactionsEvent";
import {
  transactionSortModel,
  TransactionSortModel,
} from "./transactions.sort.model";
import {
  SelectedTransactionsModel,
  selectedTransactionsModel,
} from "./transactions.selected.model";
import { DataUtils } from "../utils/DataUtils/DataUtils";
import { lightFormat } from "date-fns";

export interface TransactionsModel {
  //==============================================================//
  // SUBMODELS
  //==============================================================//

  /**
   * Selected properties (copies of the above properties using only
   * selected items i.e. items in the current interval)
   */
  selected: SelectedTransactionsModel;

  /**
   * Current sorting strategy model
   */
  sort: TransactionSortModel;

  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * All user's current transactions
   */
  items: Transaction[];

  /**
   * Has the user loaded the transactions
   */
  initialized: boolean;

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  /**
   * Filtered items
   */
  filteredItems: Computed<TransactionsModel, Transaction[], StoreModel>;

  /**
   * All categories
   */
  categories: Computed<TransactionsModel, Transaction["category"][]>;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Set all transactions to state
   */
  setTransactionsToState: Action<TransactionsModel, Transaction[]>;

  /**
   * Add multiple transaction to state or if matching transactions by ID already
   * exists in state, change them.
   */
  upsertTransactionsToState: Action<TransactionsModel, Transaction[]>;

  /**
   * Removes transactions from the state
   */
  removeTransactionsFromStateById: Action<TransactionsModel, string[]>;

  /**
   * Clears the state
   */
  clearState: Action<TransactionsModel, void>;

  //==============================================================//
  // THUNKS
  //==============================================================//

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
   * Patch and update transaction to state
   */
  patchTransaction: Thunk<
    TransactionsModel,
    Parameters<typeof TransactionService["patchTransaction"]>[0],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["patchTransaction"]>
  >;

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Listening to auth changes (fetching data on login,
   * clearing state on logout)
   */
  onAuthChanged: ThunkOn<TransactionsModel, any, StoreModel>;
}

export const transactionsModel: TransactionsModel = {
  //==============================================================//
  // SUBMODELS
  //==============================================================//

  selected: selectedTransactionsModel,
  sort: transactionSortModel,

  //==============================================================//
  // PROPERTIES
  //==============================================================//

  items: [],
  initialized: false,

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  filteredItems: computed(
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

  categories: computed((state) =>
    DataUtils.unique(
      state.items.map((_) => _.category),
      (a, b) => a.id === b.id
    )
  ),

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setTransactionsToState: action((state, transactions) => {
    state.items = transactions;
    state.initialized = true;
  }),

  upsertTransactionsToState: action((state, transactions) => {
    transactions.forEach((transaction) => {
      if (state.items.find((_) => _.id === transaction.id)) {
        state.items = state.items.map((_) => {
          return _.id === transaction.id ? transaction : _;
        });
      } else {
        state.items.push(transaction);
      }
    });
  }),

  removeTransactionsFromStateById: action((state, ids) => {
    state.items = state.items.filter((transaction) => {
      return !ids.includes(transaction.id);
    });
  }),

  clearState: action((state) => {
    state.items = [];
  }),

  //==============================================================//
  // THUNKS
  //==============================================================//

  getTransactions: thunk(async (actions) => {
    const result = await TransactionService.getTransactions();
    if (result.isSuccess()) {
      actions.setTransactionsToState(
        Transaction.parseCompressedData(result.value)
      );
    } else {
      actions.setTransactionsToState([]);
    }
    return result;
  }),

  postTransaction: thunk(async (actions, json, store) => {
    const result = await TransactionService.postTransaction(json);
    if (result.isSuccess()) {
      const transaction = new Transaction(result.value);
      actions.upsertTransactionsToState([transaction]);
    }
    return result;
  }),

  postTransactions: thunk(async (actions, jsons, store) => {
    const result = await TransactionService.postTransactions(jsons);
    if (result.isSuccess()) {
      actions.upsertTransactionsToState(
        Transaction.parseCompressedData(result.value)
      );
    }
    return result;
  }),

  deleteTransaction: thunk(
    async (actions, id, { getState, getStoreActions }) => {
      // Get transaction and ensure one exists
      const transaction = getState().items.find((_) => _.id === id);

      // Delete the transaction
      actions.removeTransactionsFromStateById([id]);
      const result = await TransactionService.deleteTransaction(id);

      // If deletion succeeds, create deletion event
      if (result.isSuccess() && transaction) {
        getStoreActions().history.pushEvent(
          new DeleteTransactionEvent(transaction)
        );
      }

      // If deletion fails, put transaction back
      else if (result.isFailure() && transaction) {
        actions.upsertTransactionsToState([transaction]);
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
      actions.removeTransactionsFromStateById(transactions.map((_) => _.id));
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
        actions.upsertTransactionsToState(transactions);
      }
      return result;
    }
  ),

  putTransaction: thunk(async (actions, json, store) => {
    const result = await TransactionService.putTransaction(json);
    if (result.isSuccess()) {
      const transaction = new Transaction(result.value);
      actions.upsertTransactionsToState([transaction]);
    }
    return result;
  }),

  patchTransaction: thunk(async (actions, json, store) => {
    const result = await TransactionService.patchTransaction(json);
    if (result.isSuccess()) {
      const transaction = new Transaction(result.value);
      actions.upsertTransactionsToState([transaction]);
    }
    return result;
  }),

  //==============================================================//
  // LISTENERS
  //==============================================================//

  onAuthChanged: thunkOn(
    (_, store) => [store.auth.logout, store.auth.setAuthToState],
    (actions, target) => {
      const [loggedOut, loggedIn] = target.resolvedTargets;
      switch (target.type) {
        case loggedOut:
          actions.clearState();
          break;
        case loggedIn:
          actions.getTransactions();
          break;
      }
    }
  ),
};
