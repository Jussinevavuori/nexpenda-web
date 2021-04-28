import { useState, useCallback } from "react";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { useStoreState } from "../../store";
import { useBudgetBlockMenuDialogVariableOpenState } from "../BudgetBlockMenu/useBudgetBlockMenuController";
import { BudgetBlockProps } from "./BudgetBlock";

export function useBudgetBlockController(props: BudgetBlockProps) {
  const categories = useStoreState((_) => _.transactions.categories);
  const context = useBudgetsContext();
  const isMonth = useStoreState((_) => _.interval.isMonth);

  const progress = context.extendedBudgets.find(
    (_) => _.budget.id === props.budget.id
  );

  const budgetId = props.budget.id;
  const budgetCategories = props.budget.getCategories(categories);
  const budgetLabel = props.budget.getLabel(categories);

  const { 1: setMenuId } = useBudgetBlockMenuDialogVariableOpenState();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement>();

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setMenuId(budgetId);
      setMenuAnchorEl(e.currentTarget);
    },
    [setMenuAnchorEl, setMenuId, budgetId]
  );

  return {
    budgetCategories,
    budgetLabel,
    budgetNotFound: !progress,
    budget: props.budget,
    progress:
      progress?.progressAmount[isMonth ? "monthly" : "absolute"] ??
      new MoneyAmount(0),
    percentage:
      progress?.progressPercentage[isMonth ? "monthly" : "absolute"] ?? 0,
    budgetAmount: props.budget.monthlyAmount.multiply(
      context.data.intervalLengthInMonths
    ),
    isAveraged:
      context.data.intervalLengthInMonths < (props.budget.periodMonths ?? 0),

    menuAnchorEl,
    handleMenuOpen,
  };
}
