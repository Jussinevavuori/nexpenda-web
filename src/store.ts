import { createStore, createTypedHooks } from "easy-peasy";
import { AuthModel, authModel } from "./models/auth.model";
import {
  TransactionsModel,
  transactionsModel,
} from "./models/transactions.model";
import { intervalModel, IntervalModel } from "./models/interval.model";
import {
  notificationModel,
  NotificationModel,
} from "./models/notification.model";
import { selectionModel, SelectionModel } from "./models/selection.model";
import { historyModel, HistoryModel } from "./models/history.model";
import { configModel, ConfigModel } from "./models/config.model";
import { stripeModel, StripeModel } from "./models/stripe.model";

export interface StoreModel {
  notification: NotificationModel;
  transactions: TransactionsModel;
  selection: SelectionModel;
  interval: IntervalModel;
  history: HistoryModel;
  auth: AuthModel;
  config: ConfigModel;
  stripe: StripeModel;
}

const storeModel: StoreModel = {
  notification: notificationModel,
  transactions: transactionsModel,
  selection: selectionModel,
  interval: intervalModel,
  history: historyModel,
  auth: authModel,
  config: configModel,
  stripe: stripeModel,
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
