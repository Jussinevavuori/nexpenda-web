import { z } from "zod";
import { Category } from "./Category";
import { MoneyAmount } from "../Money/MoneyAmount";
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
   * How many months is the period of this budget? Defaults to 1.
   */
  public readonly periodMonths: number;

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
    this.periodMonths = json.periodMonths;
  }

  /**
   * Get type of budget. Budgets with negative integer amounts are considered
   * expense budgets while budgets with non-negative integer amounts are
   * considered income budgets.
   */
  get type() {
    return this.integerAmount >= 0 ? "income" : "expense";
  }

  /**
   * Check if this budget is an income budget. (Has non-negative integer amount)
   */
  get isIncome() {
    return this.integerAmount >= 0;
  }

  /**
   * Check if this budget is an expense budget. (Has negative integer amount)
   */
  get isExpense() {
    return this.integerAmount < 0;
  }

  /**
   * Get the monthly amount for this budget, which is the amount divided by
   * the period.
   */
  get monthlyAmount() {
    return this.amount.divide(this.periodMonths);
  }

  /**
   * Provided list of all categories, fetch a label for this budget. If no
   * internal label is provided, the label is automatically generated from
   * the existing categories.
   */
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
   * Returns the internal, user specified label
   */
  get customLabel() {
    return this._label;
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
   * Convert Budget to JsonTransaction
   */
  toJson(): JsonBudget {
    return {
      id: this.id,
      label: this._label,
      categoryIds: this.categoryIds,
      createdAt: this.createdAt.getTime(),
      integerAmount: this.integerAmount,
      periodMonths: this.periodMonths,
    };
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

  static Schema = z.object({
    id: z.string(),
    label: z.string().optional(),
    integerAmount: z.number().int(),
    createdAt: z.number().positive().int(),
    categoryIds: z.array(z.string()),
    periodMonths: z.number().positive().int(),
  });

  static ArraySchema = z.array(Budget.Schema);
}
