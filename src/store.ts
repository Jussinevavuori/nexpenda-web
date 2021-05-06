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
import { themeModel, ThemeModel } from "./models/theme.model";
import { stripeModel, StripeModel } from "./models/stripe.model";
import { budgetsModel, BudgetsModel } from "./models/budgets.model";
import { SidebarModel, sidebarModel } from "./models/sidebar.model";
import { AppConfigModel, appConfigModel } from "./models/appConfig.model";

export interface StoreModel {
  notification: NotificationModel;
  transactions: TransactionsModel;
  selection: SelectionModel;
  interval: IntervalModel;
  history: HistoryModel;
  auth: AuthModel;
  theme: ThemeModel;
  stripe: StripeModel;
  budgets: BudgetsModel;
  sidebar: SidebarModel;
  appConfig: AppConfigModel;
}

const storeModel: StoreModel = {
  notification: notificationModel,
  transactions: transactionsModel,
  selection: selectionModel,
  interval: intervalModel,
  history: historyModel,
  auth: authModel,
  theme: themeModel,
  stripe: stripeModel,
  budgets: budgetsModel,
  sidebar: sidebarModel,
  appConfig: appConfigModel,
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
