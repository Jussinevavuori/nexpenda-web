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
import {
  transactionSortModel,
  TransactionSortModel,
} from "./transactions.sort.model";
import {
  SelectedTransactionsModel,
  selectedTransactionsModel,
} from "./transactions.selected.model";
import { CompressedData } from "../classes/CompressedData";
import { Category } from "../classes/Category";
import { DataUtils } from "../utils/DataUtils/DataUtils";

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
   * Filtered properties (copies of the above properties using only
   * filtered items)
   */
  filtered: FilteredTransactionsModel;

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
   * All categories
   */
  categories: Computed<TransactionsModel, Category[]>;

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
   * Minimum possible amount
   */
  minimumAmount: Computed<TransactionsModel, MoneyAmount>;

  /**
   * Maximum possible amount
   */
  maximumAmount: Computed<TransactionsModel, MoneyAmount>;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Set all transactions to state
   */
  setTransactionsToState: Action<TransactionsModel, Transaction[]>;

  /**
   * Add single transaction to state or if one with that ID already
   * exists in state, change it
   */
  upsertTransactionToState: Action<TransactionsModel, Transaction>;

  /**
   * Removes a transaction from the state
   */
  removeTransactionFromStateById: Action<TransactionsModel, string>;

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
  selected: selectedTransactionsModel,
  filtered: filteredTransactionsModel,
  sort: transactionSortModel,

  items: [],
  initialized: false,

  itemsByDates: computed((state) => {
    return DateUtils.groupByDate(state.items, (_) => _.date, {
      sort: true,
    });
  }),

  categories: computed((state) =>
    DataUtils.unique(
      state.items.map((_) => _.category),
      (a, b) => a.id === b.id
    )
  ),

  count: computed((state) => state.items.length),

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

  getTransactions: thunk(async (actions) => {
    const result = await TransactionService.getTransactions();
    if (result.isSuccess()) {
      actions.setTransactionsToState(CompressedData.parse(result.value));
    } else {
      actions.setTransactionsToState([]);
    }
    return result;
  }),

  setTransactionsToState: action((state, transactions) => {
    state.items = transactions;
    state.initialized = true;
  }),

  upsertTransactionToState: action((state, transaction) => {
    if (state.items.find((_) => _.id === transaction.id)) {
      state.items = state.items.map((_) => {
        return _.id === transaction.id ? transaction : _;
      });
    } else {
      state.items.push(transaction);
    }
  }),

  removeTransactionFromStateById: action((state, id) => {
    state.items = state.items.filter((_) => _.id !== id);
  }),

  clearState: action((state) => {
    state.items = [];
  }),

  postTransaction: thunk(async (actions, json, store) => {
    const result = await TransactionService.postTransaction(json);
    if (result.isSuccess()) {
      const transaction = createTransaction(
        result.value,
        store.getState().categories
      );
      actions.upsertTransactionToState(transaction);
    }
    return result;
  }),

  postTransactions: thunk(async (actions, jsons, store) => {
    const result = await TransactionService.postTransactions(jsons);
    if (result.isSuccess()) {
      result.value.forEach((json) => {
        const transaction = createTransaction(
          json,
          store.getState().categories
        );
        actions.upsertTransactionToState(transaction);
      });
    }
    return result;
  }),

  deleteTransaction: thunk(
    async (actions, id, { getState, getStoreActions }) => {
      // Get transaction and ensure one exists
      const transaction = getState().items.find((_) => _.id === id);

      // Delete the transaction
      actions.removeTransactionFromStateById(id);
      const result = await TransactionService.deleteTransaction(id);

      // If deletion succeeds, create deletion event
      if (result.isSuccess() && transaction) {
        getStoreActions().history.pushEvent(
          new DeleteTransactionEvent(transaction)
        );
      }

      // If deletion fails, put transaction back
      else if (result.isFailure() && transaction) {
        actions.upsertTransactionToState(transaction);
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
        actions.removeTransactionFromStateById(transaction.id);
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
          actions.upsertTransactionToState(transaction);
        });
      }
      return result;
    }
  ),

  putTransaction: thunk(async (actions, json, store) => {
    const result = await TransactionService.putTransaction(json);
    if (result.isSuccess()) {
      const transaction = createTransaction(
        result.value,
        store.getState().categories
      );
      actions.upsertTransactionToState(transaction);
    }
    return result;
  }),

  patchTransaction: thunk(async (actions, json, store) => {
    const result = await TransactionService.patchTransaction(json);
    if (result.isSuccess()) {
      const transaction = createTransaction(
        result.value,
        store.getState().categories
      );
      actions.upsertTransactionToState(transaction);
    }
    return result;
  }),

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

/**
 * Creates a transaction from the json and utilizes an existing category
 * object if one is available - if not, creates a new category object
 * with the correct details.
 *
 * @param json JsonTransaction
 * @param categories All existing categories
 */
function createTransaction(
  json: JsonTransaction,
  categories: Category[]
): Transaction {
  const category =
    categories.find((_) => _.id === json.category.id) ??
    new Category({
      id: json.category.id,
      value: json.category.value,
      incomeIcon: json.category.incomeIcon,
      expenseIcon: json.category.expenseIcon,
    });
  return new Transaction(json, category);
}
