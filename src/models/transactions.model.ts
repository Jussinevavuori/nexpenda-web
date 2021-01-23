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
import { DeleteTransactionEvent } from "../history/DeleteTransactionEvent";
import { DeleteTransactionsEvent } from "../history/DeleteTransactionsEvent";
import { DataUtils } from "../utils/DataUtils/DataUtils";

export interface TransactionsModel {
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

  /**
   * Current sorting strategy
   */
  sortingStrategy: TransactionSortStrategy;

  /**
   * Current search term
   */
  searchTerm: string;

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

  /**
   * Toggle the current sorting strategy by a sorting property
   */
  toggleSortingStrategy: Action<TransactionsModel, TransactionSortableProperty>;

  /**
   * Directly set the current sorting strategy to the specified one
   */
  setSortingStrategy: Action<TransactionsModel, TransactionSortStrategy>;

  /**
   * Directly set the current search term
   */
  setSearchTerm: Action<TransactionsModel, string>;

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
  // PROPERTIES
  //==============================================================//

  items: [],
  initialized: false,
  sortingStrategy: "date-descending",
  searchTerm: "",

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  filteredItems: computed(
    [
      (_) => _.items,
      (_) => _.searchTerm,
      (_, storeState) => storeState.interval,
    ],
    (items, searchTerm, interval) => {
      return items.filter((t) => {
        return t.filter(searchTerm, interval.startDate, interval.endDate);
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

  toggleSortingStrategy: action((state, property) => {
    // Define all carousels: each toggle on a property will toggle the sort to
    // the next sort state in the property's carousel, while clicking on any
    // other property will set it to the first sort state in the new property's
    // carousel.
    const carousels: Record<
      TransactionSortableProperty,
      TransactionSortStrategy[]
    > = {
      amount: ["amount-descending", "amount-ascending", "none"],
      category: ["category-descending", "category-ascending", "none"],
      comment: ["comment-descending", "comment-ascending", "none"],
      date: ["date-descending", "date-ascending", "none"],
    };

    // Get the current sort
    const currentStrategy = state.sortingStrategy;

    // Get the current carousel
    const carousel = carousels[property];

    // Figure out the index of the item in the carousel which is currently
    // active or default to -1 for "no item found"
    const activeSortIndex = carousel.findIndex((_) => _ === currentStrategy);

    // Get the next item's index in the carousel
    const targetSortIndex = (activeSortIndex + 1) % carousel.length;

    // Return the next item in the carousel
    state.sortingStrategy = carousel[targetSortIndex];
  }),

  setSortingStrategy: action((state, sort) => {
    state.sortingStrategy = sort;
  }),

  setSearchTerm: action((state, searchTerm) => {
    state.searchTerm = searchTerm;
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
