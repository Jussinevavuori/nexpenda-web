/**
 * Defines a category object
 */
export class Category {
  /**
   * Category ID
   */
  public id: string;

  /**
   * Category value or name
   */
  public value: string;

  /**
   * Category icon
   */
  public icon: string;

  constructor(json: JsonCategory) {
    this.id = json.id;
    this.value = json.value;
    this.icon = json.icon;
  }

  /**
   * Alias value as name
   */
  public get name() {
    return this.value;
  }

  static defaultIncomeIcon = "💰";
  static defaultExpenseIcon = "💸";

  /**
   * Category icon. Based on the given sign uses either the default income
   * icon or default expense icon.
   */
  public getDefaultedIcon(sign: number | "+" | "-" = "+") {
    const _sign = sign === "+" ? 1 : sign === "-" ? -1 : sign;
    const defaultIcon =
      _sign > 0 ? Category.defaultIncomeIcon : Category.defaultExpenseIcon;
    return this.icon || defaultIcon;
  }

  /**
   * Get the full label of the category, which includes the name and the icon.
   * Uses a defaulted icon, using the given sign.
   */
  public getFullLabel(sign: number | "+" | "-" = "+") {
    return `${this.getDefaultedIcon(sign)} ${this.name}`;
  }

  /**
   * Get non-whitespace version of the category's value (name) by replacing
   * all whitespace with a dash, all in lowercase
   *
   * @example
   * ```
   * Category.value = "Other expenses"
   * Category.slug = "other-expenses"
   * ```
   */
  public get slug() {
    return this.value.toLowerCase().replace(/\s+/g, "-");
  }
}
