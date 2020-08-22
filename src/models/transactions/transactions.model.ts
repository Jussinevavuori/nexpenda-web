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
  /**
   * Items
   */
  items: [],

  /**
   * Items count
   */
  count: computed((state) => state.items.length),

  /**
   * GET transactions Thunk and Action
   */
  getTransactions: thunk(async (actions) => {
    console.log("Getting transactions");
    const { data } = await transactionService.getTransactions();
    console.log({ data });
    if (isServerError(data)) {
      return data;
    } else if (isJsonTransactionArray(data)) {
      actions._getTransactions(data);
    }
  }),
  _getTransactions: action((state, jsons) => {
    state.items = jsons.map((json) => new Transaction(json));
  }),

  /**
   * POST transactions Thunk and Action
   */
  postTransaction: thunk(async (actions, json) => {
    const { data } = await transactionService.postTransaction(json);
    console.log({ data });
    if (isServerError(data)) {
      return data;
    } else if (data) {
      actions._postTransaction(data);
    }
  }),

  _postTransaction: action((state, json) => {
    state.items.push(new Transaction(json));
  }),

  /**
   * DELETE transactions Thunk and Action
   */
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

  /**
   * PUT transactions Thunk and Action
   */
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

  /**
   * PATCH transactions Thunk and Action
   */
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
    (_, store) => [store.auth.logOut, store.auth._login],
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
