import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { BudgetsOverviewProps } from "./BudgetsOverview";

export function useBudgetsOverviewController(props: BudgetsOverviewProps) {
  const budgets = useBudgetsContext();

  return {
    ...budgets.budgetTotals,
  };
}
