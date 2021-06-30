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
import { SearchModel, searchModel } from "./models/search.model";
import { exposeToWindow } from "./lib/Utilities/exposeToWindow";
import { schedulesModel, SchedulesModel } from "./models/schedules.model";
import {
  premiumPricesModel,
  PremiumPricesModel,
} from "./models/premiumPrices.model";

export interface StoreModel {
  appConfig: AppConfigModel;
  auth: AuthModel;
  budgets: BudgetsModel;
  history: HistoryModel;
  interval: IntervalModel;
  notification: NotificationModel;
  premiumPrices: PremiumPricesModel;
  search: SearchModel;
  selection: SelectionModel;
  schedules: SchedulesModel;
  sidebar: SidebarModel;
  stripe: StripeModel;
  theme: ThemeModel;
  transactions: TransactionsModel;
}

const storeModel: StoreModel = {
  appConfig: appConfigModel,
  auth: authModel,
  budgets: budgetsModel,
  history: historyModel,
  interval: intervalModel,
  notification: notificationModel,
  premiumPrices: premiumPricesModel,
  search: searchModel,
  selection: selectionModel,
  schedules: schedulesModel,
  sidebar: sidebarModel,
  stripe: stripeModel,
  transactions: transactionsModel,
  theme: themeModel,
};

export const store = createStore(storeModel, {
  name: "Nexpenda Store",
  devTools: process.env.NODE_ENV !== "production",
});

exposeToWindow({
  store,
  setThemeColor(themeColor: ThemeColor) {
    store.getActions().auth.updateProfile({ themeColor });
    store.getActions().theme.setThemeColor(themeColor);
  },
  setThemeMode(themeMode: ThemeMode) {
    store.getActions().auth.updateProfile({ themeMode });
    store.getActions().theme.setThemeMode(themeMode);
  },
  toggleThemeColor() {
    const now = store.getState().theme.themeColor;
    let themeColor = ((): ThemeColor => {
      switch (now) {
        case "blue":
          return "green";
        case "green":
          return "pink";
        case "pink":
          return "purple";
        case "purple":
          return "red";
        case "red":
          return "yellow";
        case "yellow":
          return "blue";
      }
    })();
    store.getActions().auth.updateProfile({ themeColor });
    store.getActions().theme.setThemeColor(themeColor);
  },
  toggleThemeMode() {
    const now = store.getState().theme.themeMode;
    let themeMode = ((): ThemeMode => {
      switch (now) {
        case "dark":
          return "light";
        case "light":
          return "dark";
      }
    })();
    store.getActions().auth.updateProfile({ themeMode });
    store.getActions().theme.setThemeMode(themeMode);
  },
});

export const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
export const useStore = typedHooks.useStore;
