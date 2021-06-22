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
      const json = budget.toJsonInitializer({ id: true });
      const put = store.getActions().budgets.putBudget;
      return put(json);
    });
    this.budget = budget;
  }
}
