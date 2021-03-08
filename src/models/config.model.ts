import { action, Action, ActionOn, actionOn } from "easy-peasy";
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
}

export const configModel: ConfigModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  theme: "blue",

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
};
