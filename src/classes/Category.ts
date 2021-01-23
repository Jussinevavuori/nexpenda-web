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
   * Category icon
   */
  public readonly icon: string;

  constructor(json: JsonTransaction["category"]) {
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
}
