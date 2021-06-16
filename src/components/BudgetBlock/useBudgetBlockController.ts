import { useCallback } from "react";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { useBudgetMenuState } from "../../hooks/componentStates/useBudgetMenuState";
import { useStoreState } from "../../store";
import { BudgetBlockProps } from "./BudgetBlock";

export function useBudgetBlockController(props: BudgetBlockProps) {
  const budget = props.budget;

  const categories = useStoreState((_) => _.transactions.categories);
  const context = useBudgetsContext();
  const isMonth = useStoreState((_) => _.interval.isMonth);

  const progress = context.extendedBudgets.find(
    (_) => _.budget.id === budget.id
  );

  const budgetCategories = budget.getCategories(categories);
  const budgetLabel = budget.getLabel(categories);

  const menu = useBudgetMenuState();

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      menu.handleOpen(e, budget);
    },
    [budget, menu]
  );

  return {
    budgetCategories,
    budgetLabel,
    budgetNotFound: !progress,
    budget,
    progress:
      progress?.progressAmount[isMonth ? "monthly" : "absolute"] ??
      new MoneyAmount(0),
    percentage:
      progress?.progressPercentage[isMonth ? "monthly" : "absolute"] ?? 0,
    budgetAmount: budget.monthlyAmount.multiply(
      context.data.intervalLengthInMonths
    ),
    isAveraged:
      context.data.intervalLengthInMonths < (budget.periodMonths ?? 0),

    handleMenuOpen,
    menu,
  };
}
