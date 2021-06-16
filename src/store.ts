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
import { exposeToWindow } from "./utils/Utils/exposeToWindow";

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
  search: SearchModel;
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
  search: searchModel,
  appConfig: appConfigModel,
};

export const store = createStore(storeModel);

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
