import { LogService } from "../../services/LogService";
import { StorageService } from "../../services/StorageService";

export class ThemeUtils {
  // Initialize theme variables
  static initialize() {
    const initialThemeColor = StorageService.latestSelectedThemeColor.getValue();
    if (initialThemeColor) {
      ThemeUtils.switchThemeColorVariables(initialThemeColor);
    }

    const initialThemeMode = StorageService.latestSelectedThemeMode.getValue();
    if (initialThemeMode) {
      ThemeUtils.updateThemeMode(initialThemeMode);
    }
    // ThemeUtils.updateThemeMode("dark");
  }

  /**
   * Default theme color
   */
  static freeDefaultThemeColor: ThemeColor = "blue";

  /**
   * Property to access all theme colors
   */
  static themeColors: ThemeColor[] = [
    "blue",
    "green",
    "red",
    "yellow",
    "pink",
    "purple",
  ];

  /**
   * Property to access all freemium themes
   */
  static freeThemeColors: ThemeColor[] = ["blue", "green"];

  /**
   * Property to access all premium themes
   */
  static premiumThemeColors: ThemeColor[] = ["red", "yellow", "pink", "purple"];

  /**
   * Property to access all theme modes
   */
  static themeModes: ThemeMode[] = ["dark", "light"];

  /**
   * Check if a theme is a premium theme
   */
  static isPremiumThemeColor(theme: ThemeColor) {
    return this.premiumThemeColors.includes(theme);
  }

  /**
   * Check if a variable is a valid theme color
   */
  static isThemeColor(val: any): val is ThemeColor {
    return (
      typeof val === "string" && this.themeColors.includes(val as ThemeColor)
    );
  }

  /**
   * Check if a variable is a valid theme mode
   */
  static isThemeMode(val: any): val is ThemeMode {
    return (
      typeof val === "string" && this.themeModes.includes(val as ThemeMode)
    );
  }

  /**
   * Property to access all theme property labels
   */
  static themePropertyLabels: ThemePropertyLabel[] = [
    "color-100",
    "color-200",
    "color-300",
    "color-400",
    "color-500",
    "color-600",
    "color-700",
    "color-800",
    "color-900",
  ];

  /**
   * Utility function to switch all CSS variables to those of another theme
   *
   * @param themeColor Theme color to switch to
   */
  static switchThemeColorVariables(themeColor: ThemeColor) {
    const properties = this.getThemeProperties(themeColor);
    properties.forEach((property) => {
      const value = this.getVariableValue(property.sourceName);
      this.setVariableValue(property.targetName, value);
    });
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

  /**
   * Utility method to access the root element which holds all CSS
   * theme variables
   */
  static getVariableElement() {
    return document.documentElement;
  }

  /**
   * Utility function to access a CSS variable value by name
   *
   * @param name Property name, not including ("--")
   */
  static getVariableValue(name: string) {
    const el = this.getVariableElement();
    return window.getComputedStyle(el).getPropertyValue("--" + name);
  }

  /**
   * Utility function to set a CSS variable value by name
   *
   * @param name Property name, not including ("--")
   * @param value Target value
   */
  static setVariableValue(name: string, value: string) {
    const el = this.getVariableElement();
    el.style.setProperty("--" + name, value);
  }

  static getThemeProperty(
    theme: ThemeColor,
    label: ThemePropertyLabel
  ): ThemeProperty {
    switch (label) {
      case "color-100":
        return {
          type: "color",
          label: "color-100",
          targetName: `primary-100`,
          sourceName: `${theme}-100`,
        };
      case "color-200":
        return {
          type: "color",
          label: "color-200",
          targetName: `primary-200`,
          sourceName: `${theme}-200`,
        };
      case "color-300":
        return {
          type: "color",
          label: "color-300",
          targetName: `primary-300`,
          sourceName: `${theme}-300`,
        };
      case "color-400":
        return {
          type: "color",
          label: "color-400",
          targetName: `primary-400`,
          sourceName: `${theme}-400`,
        };
      case "color-500":
        return {
          type: "color",
          label: "color-500",
          targetName: `primary-500`,
          sourceName: `${theme}-500`,
        };
      case "color-600":
        return {
          type: "color",
          label: "color-600",
          targetName: `primary-600`,
          sourceName: `${theme}-600`,
        };
      case "color-700":
        return {
          type: "color",
          label: "color-700",
          targetName: `primary-700`,
          sourceName: `${theme}-700`,
        };
      case "color-800":
        return {
          type: "color",
          label: "color-800",
          targetName: `primary-800`,
          sourceName: `${theme}-800`,
        };
      case "color-900":
        return {
          type: "color",
          label: "color-900",
          targetName: `primary-900`,
          sourceName: `${theme}-900`,
        };
    }
  }

  /**
   * Utility function to get all theme variables by their target names
   * and source names.
   *
   * @param theme Theme to decide which source names to use
   */
  static getThemeProperties(theme: ThemeColor): ThemeProperty[] {
    const labels = this.themePropertyLabels;
    return labels.map((label) => this.getThemeProperty(theme, label));
  }

  /**
   * Utility method to access a single property of a theme
   *
   * @param theme Theme
   */
  static getThemePropertyValue(
    theme: ThemeColor,
    label: ThemePropertyLabel
  ): string {
    const property = this.getThemeProperty(theme, label);
    return this.getVariableValue(property.sourceName);
  }

  /**
   * Utility method to access all properties of a theme
   *
   * @param theme Theme
   */
  static getThemePropertyValues(
    theme: ThemeColor
  ): Record<ThemePropertyLabel, string> {
    const properties = this.getThemeProperties(theme);

    const labelValueTuples = properties.map((_) => {
      return [_.label, this.getVariableValue(_.sourceName)] as [
        ThemePropertyLabel,
        string
      ];
    });

    return Object.fromEntries(labelValueTuples) as Record<
      ThemePropertyLabel,
      string
    >;
  }

  static getBrowserPreferredThemeMode(): ThemeMode {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
}
