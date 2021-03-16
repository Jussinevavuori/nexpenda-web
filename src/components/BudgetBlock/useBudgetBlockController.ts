import { useState, useCallback } from "react";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { useBudgetsContext } from "../../contexts/BudgetsContext.context";
import { useQueryState } from "../../hooks/state/useQueryState";
import { useStoreState } from "../../store";
import { BudgetBlockProps } from "./BudgetBlock";

export function useBudgetBlockController(props: BudgetBlockProps) {
  const categories = useStoreState((_) => _.transactions.categories);
  const context = useBudgetsContext();

  const progress = context.extendedBudgets.find(
    (_) => _.budget.id === props.budget.id
  );

  const budgetCategories = props.budget.getCategories(categories);
  const budgetLabel = props.budget.getLabel(categories);

  const [isMenuOpen, setIsMenuOpen] = useQueryState<boolean>({
    key: "bm",
    method: "push",
    decode: (val) => val === props.budget.id,
    encode: (val) => (val ? props.budget.id : undefined),
  });

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement>();

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setIsMenuOpen(true);
      setMenuAnchorEl(e.currentTarget);
    },
    [setMenuAnchorEl, setIsMenuOpen]
  );

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
    setMenuAnchorEl(undefined);
  }, [setMenuAnchorEl, setIsMenuOpen]);

  return {
    budgetCategories,
    budgetLabel,
    budgetNotFound: !progress,
    progress: progress?.progressAmount ?? new MoneyAmount(0),
    percentage: progress?.progressPercentage ?? 0,

    isMenuOpen,
    menuAnchorEl,
    handleMenuOpen,
    handleMenuClose,
  };
}
