import { useCallback } from "react";
import { useBudgetEditorOpenState } from "../../hooks/componentStates/useBudgetEditorOpenState";
import { useBudgetMenuState } from "../../hooks/componentStates/useBudgetMenuState";
import { useStoreActions } from "../../store";
import { BudgetBlockMenuProps } from "./BudgetBlockMenu";

export function useBudgetBlockMenuController(props: BudgetBlockMenuProps) {
  // Editing
  const budget = props.budget;
  const { handleOpen } = useBudgetEditorOpenState();
  const { targetId, handleClose } = useBudgetMenuState();
  const isOpen = targetId === budget.id;

  const handleEdit = useCallback(() => {
    handleOpen(budget, { replace: true });
  }, [handleOpen, budget]);

  // Deleting
  const deleteBudget = useStoreActions((_) => _.budgets.deleteBudget);
  function handleDelete() {
    deleteBudget(budget.id);
    handleClose();
  }

  return {
    isOpen,
    handleEdit,
    handleDelete,
    handleClose,
  };
}
