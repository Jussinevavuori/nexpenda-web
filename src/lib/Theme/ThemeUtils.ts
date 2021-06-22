import { StorageService } from "../../services/StorageService";
import { ThemeColors } from "./ThemeColors";
import { ThemeModes } from "./ThemeModes";

export class ThemeUtils {
  /**
   * Reset theme to unauthenticate user's theme
   */
  static resetTheme() {
    StorageService.latestSelectedThemeColor.setValue(undefined);
    StorageService.latestSelectedThemeMode.setValue(undefined);
  }

  /**
   * Initialize theme variables
   */
  static initialize() {
    // Attempt getting initial theme color and initializing it
    const themeColor = StorageService.latestSelectedThemeColor.getValue();
    if (themeColor) {
      ThemeColors.updateThemeColor(themeColor);
    }

    // Attempt getting initial theme mode and initializing it
    const themeMode = StorageService.latestSelectedThemeMode.getValue();
    if (themeMode) {
      ThemeModes.updateThemeMode(themeMode);
    }
  }
}
