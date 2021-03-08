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

export interface ConfigModel {
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
  setTheme: Action<ConfigModel, Theme>;

  //==============================================================//
  // LISTENERS
  //==============================================================//

  /**
   * Listen to theme changes; update css variables
   */
  onThemeChange: ActionOn<ConfigModel>;

  /**
   * Listening to auth changes
   */
  onLogin: ThunkOn<ConfigModel, any, StoreModel>;

  /**
   * Listening to auth changes
   */
  onLogout: ThunkOn<ConfigModel, any, StoreModel>;
}

export const configModel: ConfigModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  theme: StorageService.latestSelectedTheme.getValue() ?? "blue",

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
        actions.setTheme(theme);
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
