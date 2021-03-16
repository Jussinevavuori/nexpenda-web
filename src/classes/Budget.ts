import * as z from "zod";
import { Category } from "./Category";
import { MoneyAmount } from "./MoneyAmount";
import { Transaction } from "./Transaction";

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
   * Integer amount of budget. Negative values correspond to expense budgets,
   * while positive amounts correspond to estimated incomes.
   */
  public readonly integerAmount: number;

  /**
   * Money amount of the budget. Negative values correspond to expense budgets,
   * while positive amounts correspond to estimated incomes.
   */
  public readonly amount: MoneyAmount;

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
    this.integerAmount = json.integerAmount;
    this.amount = new MoneyAmount(json.integerAmount);
    this.createdAt = new Date(json.createdAt);
    this.categoryIds = json.categoryIds;
  }

  get type() {
    return this.integerAmount >= 0 ? "income" : "expense";
  }

  get isIncome() {
    return this.integerAmount >= 0;
  }

  get isExpense() {
    return this.integerAmount < 0;
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
   * Check if a budget includes a transaction. A budget includes a transaction
   * if their signs match and the transaction's category is included in the
   * budget.
   */
  includesTransaction(transaction: Transaction) {
    const signMatch =
      (this.isIncome && transaction.amount.isNonNegative) ||
      (this.isExpense && transaction.amount.isNegative);
    if (!signMatch) {
      return false;
    }
    return this.categoryIds.some((_) => _ === transaction.category.id);
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
      label: this._label,
    };

    if (options.id) {
      return { ...json, id: this.id };
    } else {
      return json;
    }
  }

  /**
   * Separates a list of budgets into income budgets and expense budgets
   */
  static separateBudgets(budgets: Budget[]) {
    let incomeBudgets: Budget[] = [];
    let expenseBudgets: Budget[] = [];

    for (const budget of budgets) {
      if (budget.isExpense) {
        expenseBudgets.push(budget);
      } else {
        incomeBudgets.push(budget);
      }
    }

    return {
      incomeBudgets,
      expenseBudgets,
    };
  }
}
