import { action, Action, ActionOn, actionOn } from "easy-peasy";

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
      const theme = target.payload;
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      console.log(`New theme: ${theme}`);
      nums.forEach((num) => {
        const root = document.documentElement;
        const value = window
          .getComputedStyle(root)
          .getPropertyValue(`--${theme}-${num}00`);
        console.log(
          `Changing "--primary-${num}00" to "--${theme}-${num}00" (${value})`
        );
        root.style.setProperty(`--primary-${num}00`, value);
      });
    }
  ),
};
