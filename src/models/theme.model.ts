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
   * Current theme
   */
  theme: Theme;

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Sets the theme
   */
  setTheme: Action<ThemeModel, Theme>;

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Listen to theme changes; update css variables
   */
  onThemeChange: ActionOn<ThemeModel>;

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

  theme:
    StorageService.latestSelectedTheme.getValue() ??
    ThemeUtils.freeDefaultTheme,

  //==============================================================//
  // ACTIONS
  //==============================================================//

  setTheme: action((state, payload) => {
    state.theme = payload;
  }),

  //==============================================================//
  // LISTENERS
  //==============================================================//

  onThemeChange: actionOn(
    (actions) => actions.setTheme,
    (_state, target) => {
      ThemeUtils.switchThemeVariables(target.payload);
    }
  ),

  onLogin: thunkOn(
    (_, store) => store.auth.setAuthToState,
    (actions, target) => {
      const theme = target.payload.prefersColorScheme;
      if (ThemeUtils.isTheme(theme)) {
        if (ThemeUtils.isPremiumTheme(theme)) {
          if (target.payload.isPremium) {
            actions.setTheme(theme);
          } else {
            actions.setTheme(ThemeUtils.freeDefaultTheme);
            StorageService.latestSelectedTheme.clearValue();
          }
        } else {
          actions.setTheme(theme);
        }
      }
    }
  ),

  onLogout: thunkOn(
    (_, store) => store.auth.logout,
    (actions, target) => {
      actions.setTheme("blue");
      StorageService.latestSelectedTheme.setValue(undefined);
    }
  ),
};
