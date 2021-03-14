import * as z from "zod";
import { Category } from "./Category";

export class Budget {
  /**
   * ID of budget
   */
  public readonly id: string;

  /**
   * Internal optional label
   */
  private readonly _label: undefined | string;

  /**
   * Type of budget
   */
  public readonly type: BudgetType;

  /**
   * Integer amount of budget. If budget is type EXPENSE,
   * this is the max limit. If budget is type INCOME, this is
   * the appromixated income.
   */
  public readonly integerAmount: number;

  /**
   * Creation date
   */
  public readonly createdAt: Date;

  /**
   * All category IDs
   */
  public readonly categoryIds: string[];

  constructor(json: JsonBudget) {
    this.id = json.id;
    this._label = json.label;
    this.type = json.type;
    this.integerAmount = json.integerAmount;
    this.createdAt = new Date(json.createdAt);
    this.categoryIds = json.categoryIds;
  }

  getLabel(allCategories: Category[]) {
    if (this._label) {
      return this._label;
    }

    const categories = this.getCategories(allCategories).map((_) => _.name);
    let label = "";
    for (let i = 0; i < categories.length; i++) {
      label += categories[i];
      if (i !== categories.length - 1) {
        if (i === categories.length - 2) {
          label += " & ";
        } else {
          label += ", ";
        }
      }
    }

    return label;
  }

  /**
   * All categories matching this budget
   */
  getCategories(allCategories: Category[]) {
    return allCategories.filter((_) => this.categoryIds.includes(_.id));
  }

  /**
   * Schema of budget JSON objects
   */
  static Schema = z.object({
    id: z.string(),
    label: z.string().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    integerAmount: z.number().int(),
    createdAt: z.number().positive().int(),
    categoryIds: z.array(z.string()),
  });

  /**
   * Schema for array of budget JSON objects
   */
  static ArraySchema = z.array(Budget.Schema);

  /**
   * Schema for validating that objects match the JsonBudgetInitializer
   * format.
   */
  static InitializerSchema = z.object({
    label: z.string().optional(),
    type: z.enum(["INCOME", "EXPENSE"]),
    integerAmount: z.number().int(),
    categoryIds: z.array(z.string()),
  });

  /**
   * Schema for validating that objects match the JsonBudgetInitializer
   * format.
   */
  static IdInitializerSchema = Budget.InitializerSchema.merge(
    z.object({
      id: z.string(),
    })
  );

  /**
   * Convert Transaction to JsonTransaction
   */
  toJson(): JsonBudget {
    return {
      id: this.id,
      label: this._label,
      type: this.type,
      categoryIds: this.categoryIds,
      createdAt: this.createdAt.getTime(),
      integerAmount: this.integerAmount,
    };
  }

  /**
   * Convert Transaction to JsonTransactionInitializer
   */
  toJsonInitializer(options: {}): JsonBudgetInitializer;
  toJsonInitializer(options: { id: true }): JsonBudgetIdInitializer;
  toJsonInitializer(
    options: { id?: true } = {}
  ): JsonBudgetInitializer | JsonBudgetIdInitializer {
    const json: JsonBudgetInitializer = {
      categoryIds: this.categoryIds,
      integerAmount: this.integerAmount,
      type: this.type,
      label: this._label,
    };

    if (options.id) {
      return { ...json, id: this.id };
    } else {
      return json;
    }
  }
}
