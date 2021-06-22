import { ThemeProperties } from "./ThemeProperties";

export class ThemeColors {
  /**
   * Default theme color
   */
  static freeDefaultThemeColor: ThemeColor = "blue";

  /**
   * Property to access all theme colors
   */
  static themeColors: NonEmptyArray<ThemeColor> = [
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
  static freeThemeColors: NonEmptyArray<ThemeColor> = ["blue", "green"];

  /**
   * Property to access all premium themes
   */
  static premiumThemeColors: NonEmptyArray<ThemeColor> = [
    "red",
    "yellow",
    "pink",
    "purple",
  ];

  /**
   * Check if a variable is a valid theme color
   */
  static isThemeColor(val: any): val is ThemeColor {
    return (
      typeof val === "string" && this.themeColors.includes(val as ThemeColor)
    );
  }

  /**
   * Check if a theme is a premium theme
   */
  static isPremiumThemeColor(theme: ThemeColor) {
    return this.premiumThemeColors.includes(theme);
  }

  /**
   * Utility function to switch all CSS variables to those of another theme
   *
   * @param themeColor Theme color to switch to
   */
  static updateThemeColor(themeColor: ThemeColor) {
    const properties = ThemeProperties.getAllPropertyDescriptions(themeColor);
    properties.forEach((property) => {
      const value = ThemeProperties.getVariableValue(property.sourceName);
      ThemeProperties.setVariableValue(property.targetName, value);
    });
  }
}
