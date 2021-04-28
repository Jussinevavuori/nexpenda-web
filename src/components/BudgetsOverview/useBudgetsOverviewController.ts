import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { useRouteData } from "../../hooks/application/useRouteData";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { routes } from "../../Routes";
import { useStoreState } from "../../store";
import { BudgetsOverviewProps } from "./BudgetsOverview";

export function useBudgetsOverviewController(props: BudgetsOverviewProps) {
  const budgets = useBudgetsContext();
  const isMonth = useStoreState((_) => _.interval.isMonth);
  const redirect = useRedirect();
  const routeData = useRouteData();

  const isBudgetsPage = routeData?.name === routes.budgets.name;
  const hasBudgets = budgets.data.budgets.length > 0;

  function handleOpenBudgets() {
    redirect(routes.budgets);
  }

  const total = isMonth
    ? budgets.budgetTotals.monthlyTotal
    : budgets.budgetTotals.absoluteTotal;

  const income = isMonth
    ? budgets.budgetTotals.monthly.income
    : budgets.budgetTotals.absolute.income;

  const expense = isMonth
    ? budgets.budgetTotals.monthly.expense
    : budgets.budgetTotals.absolute.expense;

  return {
    total,
    income,
    expense,
    suggestCreateBudgets: !isBudgetsPage && !hasBudgets,
    handleOpenBudgets,
  };
}
