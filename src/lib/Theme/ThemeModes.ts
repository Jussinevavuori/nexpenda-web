import { LogService } from "../../services/LogService";

export class ThemeModes {
  /**
   * Property to access all theme modes
   */
  static themeModes: NonEmptyArray<ThemeMode> = ["dark", "light"];

  /**
   * Check if a variable is a valid theme mode
   */
  static isThemeMode(val: any): val is ThemeMode {
    return (
      typeof val === "string" && this.themeModes.includes(val as ThemeMode)
    );
  }

  /**
   * Fetch the browser preferred theme mode
   */
  static getBrowserPreferredThemeMode(): ThemeMode {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  /**
   * Utility function to switch body classname depending on theme mode
   *
   * @param themeMode Theme mode to switch to
   */
  static updateThemeMode(themeMode: ThemeMode) {
    try {
      document.body.classList.remove(`mode-light`);
      document.body.classList.remove(`mode-dark`);
      document.body.classList.add(`mode-${themeMode}`);
    } catch (e) {
      LogService.error({
        message: `Error updating body classList for themeMode ${themeMode}`,
      });
    }
  }
}
