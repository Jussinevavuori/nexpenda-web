import {
  action,
  Action,
  ActionOn,
  actionOn,
  thunkOn,
  ThunkOn,
} from "easy-peasy";
import { StorageService } from "../services/StorageService";
import { StoreModel } from "../store";
import { ThemeUtils } from "../utils/ThemeUtils/ThemeUtils";

export interface ThemeModel {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  /**
   * Current color theme
   */
  themeColor: ThemeColor;

  /**
   * Current mode (dark mode or light mode)
   */
  themeMode: ThemeMode;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Sets the theme color
   */
  setThemeColor: Action<ThemeModel, ThemeColor>;

  /**
   * Sets the mode
   */
  setThemeMode: Action<ThemeModel, ThemeMode>;

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Listen to theme changes; update css variables
   */
  onThemeColorChange: ActionOn<ThemeModel>;

  /**
   * Listen to theme changes; update css variables
   */
  onThemeModeChange: ActionOn<ThemeModel>;

  /**
   * Listening to auth changes
   */
  onLogin: ThunkOn<ThemeModel, any, StoreModel>;

  /**
   * Listening to auth changes
   */
  onLogout: ThunkOn<ThemeModel, any, StoreModel>;
}

export const themeModel: ThemeModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  themeColor:
    StorageService.latestSelectedThemeColor.getValue() ??
    ThemeUtils.freeDefaultThemeColor,

  themeMode: StorageService.latestSelectedThemeMode.getValue() ?? "light", // ThemeUtils.getBrowserPreferredThemeMode(),
  // themeMode: "dark",

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setThemeColor: action((state, payload) => {
    state.themeColor = payload;
  }),

  setThemeMode: action((state, payload) => {
    state.themeMode = payload;
  }),

  //==============================================================//
  // LISTENERS
  //==============================================================//

  onThemeColorChange: actionOn(
    (actions) => actions.setThemeColor,
    (_state, target) => {
      ThemeUtils.switchThemeColorVariables(target.payload);
    }
  ),

  onThemeModeChange: actionOn(
    (actions) => actions.setThemeMode,
    (_state, target) => {
      ThemeUtils.updateThemeMode(target.payload);
    }
  ),

  onLogin: thunkOn(
    (_, store) => store.auth.setAuthToState,
    (actions, target) => {
      const themeColor = target.payload.themeColor;
      const themeMode = target.payload.themeMode;
      if (ThemeUtils.isThemeColor(themeColor)) {
        if (ThemeUtils.isPremiumThemeColor(themeColor)) {
          if (target.payload.isPremium) {
            actions.setThemeColor(themeColor);
          } else {
            actions.setThemeColor(ThemeUtils.freeDefaultThemeColor);
            StorageService.latestSelectedThemeColor.clearValue();
          }
        } else {
          actions.setThemeColor(themeColor);
        }
      }
      if (ThemeUtils.isThemeMode(themeMode)) {
        actions.setThemeMode(themeMode);
      }
    }
  ),

  onLogout: thunkOn(
    (_, store) => store.auth.logout,
    (actions, target) => {
      actions.setThemeColor("blue");
      StorageService.latestSelectedThemeColor.setValue(undefined);
      StorageService.latestSelectedThemeMode.setValue(undefined);
    }
  ),
};
