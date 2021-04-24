import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { useRouteData } from "../../hooks/application/useRouteData";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { routes } from "../../Routes";
import { BudgetsOverviewProps } from "./BudgetsOverview";

export function useBudgetsOverviewController(props: BudgetsOverviewProps) {
  const budgets = useBudgetsContext();

  const redirect = useRedirect();
  const routeData = useRouteData();
  const isBudgetsPage = routeData?.name === routes.budgets.name;
  const hasBudgets = budgets.data.budgets.length > 0;
  function handleOpenBudgets() {
    redirect(routes.budgets);
  }

  return {
    ...budgets.budgetTotals,
    suggestCreateBudgets: !isBudgetsPage && !hasBudgets,
    handleOpenBudgets,
  };
}
