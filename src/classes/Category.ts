import { JsonTransaction } from "./Transaction";

/**
 * Defines a category object
 */
export class Category {
  /**
   * Category ID
   */
  public readonly id: string;

  /**
   * Category value or name
   */
  public readonly value: string;

  /**
   * Category income icon
   */
  public readonly incomeIcon: string;

  /**
   * Category expense icon
   */
  public readonly expenseIcon: string;

  constructor(json: JsonTransaction["category"]) {
    this.id = json.id;
    this.value = json.value;
    this.incomeIcon = json.incomeIcon || "💰";
    this.expenseIcon = json.expenseIcon || "💸";
  }

  /**
   * Alias value as name
   */
  public get name() {
    return this.value;
  }
}
