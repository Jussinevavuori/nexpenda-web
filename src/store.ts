import { createStore, createTypedHooks } from "easy-peasy";
import {
  TransactionsModel,
  transactionsModel,
} from "./models/transactions/transactions.model";
import {
  AuthenticationModel,
  authenticationModel,
} from "./models/authentication/auth.model";

export interface StoreModel {
  transactions: TransactionsModel;
  authentication: AuthenticationModel;
}

const storeModel: StoreModel = {
  transactions: transactionsModel,
  authentication: authenticationModel,
};

export const store = createStore(storeModel);

if (process.env.NODE_ENV === "development") {
  (window as any).store = store;
}

export const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
export const useStore = typedHooks.useStore;
