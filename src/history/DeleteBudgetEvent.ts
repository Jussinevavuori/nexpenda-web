import { Budget } from "../classes/Budget";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { NetworkFailure } from "../result/NetworkFailures";
import { Success } from "../result/Success";
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
