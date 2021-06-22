export class ThemeProperties {
  /**
   * Access element (root) which holds all CSS theme variable values.
   */
  static getVariableRoot() {
    return document.documentElement;
  }

  /**
   * All property labels
   */
  static allLabels: ThemePropertyLabel[] = [
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
   * Access a CSS variable's value at variable root
   */
  static getVariableValue(name: string) {
    const root = this.getVariableRoot();
    return window.getComputedStyle(root).getPropertyValue("--" + name);
  }

  /**
   * Set a CSS value for a property at variable root
   */
  static setVariableValue(name: string, value: string) {
    const root = this.getVariableRoot();
    root.style.setProperty("--" + name, value);
  }

  /**
   * Get a property's description for a selected theme by the property's label
   */
  static getPropertyDescription(
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
   * Get all theme variable's descriptions
   */
  static getAllPropertyDescriptions(theme: ThemeColor): ThemeProperty[] {
    const labels = this.allLabels;
    return labels.map((label) => this.getPropertyDescription(theme, label));
  }

  /**
   * Access the value of a single property of a theme.
   */
  static getPropertyValue(
    theme: ThemeColor,
    label: ThemePropertyLabel
  ): string {
    const property = this.getPropertyDescription(theme, label);
    return this.getVariableValue(property.sourceName);
  }

  /**
   * Access all property values of a theme.
   */
  static getAllPropertyValues(
    theme: ThemeColor
  ): Record<ThemePropertyLabel, string> {
    const properties = this.getAllPropertyDescriptions(theme);

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
}
