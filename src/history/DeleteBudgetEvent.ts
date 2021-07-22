import { Budget } from "../lib/DataModels/Budget";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { NetworkFailure } from "../lib/Result/Failures";
import { Success } from "../lib/Result/Success";
import { store } from "../store";
import { HistoryEvent } from "./HistoryEvent";

/**
 * Defines a strategy for a single deletion event
 */
export class DeleteBudgetEvent extends HistoryEvent<
  | Success<JsonBudget, string>
  | NetworkFailure<any, { errors?: any }>
  | InvalidServerResponseFailure<JsonBudget>
> {
  readonly budget: Budget;

  constructor(budget: Budget) {
    super("budget/delete", () => {
      return store.getActions().budgets.putBudget({
        id: this.budget.id,
        label: this.budget.customLabel,
        integerAmount: this.budget.integerAmount,
        periodMonths: this.budget.periodMonths,
        categoryIds: this.budget.categoryIds,
      });
    });
    this.budget = budget;
  }
}
