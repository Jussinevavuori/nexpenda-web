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
import { SmartTransactionFilter } from "../classes/SmartTransactionFilter";

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
   * Current smart search
   */
  smartSearch: Computed<TransactionsModel, SmartTransactionFilter, StoreModel>;

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
    Parameters<typeof TransactionService["getTransactions"]>[0],
    any,
    StoreModel,
    Promise<
      | undefined
      | PromiseType<ReturnType<typeof TransactionService["getTransactions"]>>
    >
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
  massPostTransactions: Thunk<
    TransactionsModel,
    Parameters<typeof TransactionService["massPostTransactions"]>[0],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["massPostTransactions"]>
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
  massDeleteTransactions: Thunk<
    TransactionsModel,
    string[],
    any,
    StoreModel,
    ReturnType<typeof TransactionService["massDeleteTransactions"]>
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
   * Fetch data on login
   */
  onLogin: ThunkOn<TransactionsModel, any, StoreModel>;

  /**
   * Clear data on logout
   */
  onLogout: ThunkOn<TransactionsModel, any, StoreModel>;
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

  smartSearch: computed(
    [
      (_) => _.searchTerm,
      (_) => _.categories,
      (_, storeState) => storeState.interval.startDate,
      (_, storeState) => storeState.interval.endDate,
    ],
    (searchTerm, categories, startDate, endDate) => {
      return new SmartTransactionFilter(searchTerm, {
        categories,
        startDate,
        endDate,
      });
    }
  ),

  filteredItems: computed(
    [(_) => _.items, (_) => _.smartSearch],
    (items, search) => items.filter((t) => search.compare(t))
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
      // Update category icons if required
      const existingCategory = state.categories.find(
        (_) => _.id === transaction.category.id
      );
      if (
        existingCategory &&
        existingCategory.icon !== transaction.category.icon
      ) {
        state.items.forEach((t) => {
          if (t.category.id === transaction.category.id) {
            t.category.icon = transaction.category.icon;
          }
        });
      }
      // Update transaction if one with similary ID already exists
      if (state.items.find((_) => _.id === transaction.id)) {
        state.items = state.items.map((_) => {
          return _.id === transaction.id ? transaction : _;
        });
      }
      // Else add transaction if new transaction based on ID
      else {
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

  getTransactions: thunk(async (actions, payload, helpers) => {
    const result = await TransactionService.getTransactions(payload);

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

  massPostTransactions: thunk(async (actions, jsons, store) => {
    const result = await TransactionService.massPostTransactions(jsons);
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

  massDeleteTransactions: thunk(
    async (actions, ids, { getState, getStoreActions }) => {
      // Get the transactions
      const transactions = getState().items.filter((_) => {
        return ids.includes(_.id);
      });

      // Delete the transactions from the state
      actions.removeTransactionsFromStateById(transactions.map((_) => _.id));
      const result = await TransactionService.massDeleteTransactions(
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

  onLogin: thunkOn(
    (_, store) => store.auth.setAuthToState,
    async (actions) => {
      await actions.getTransactions();
    }
  ),

  onLogout: thunkOn(
    (_, store) => store.auth.logout,
    (actions) => {
      actions.clearState();
    }
  ),
};
