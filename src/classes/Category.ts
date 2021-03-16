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
