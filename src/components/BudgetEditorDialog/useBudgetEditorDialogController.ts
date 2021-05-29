import { BudgetEditorDialogProps } from "./BudgetEditorDialog";
import { useCallback, useMemo } from "react";
import { useStoreState } from "../../store";
import { useBudgetEditorDialogVariableOpenState } from "../../hooks/componentStates/useBudgetEditorDialogVariableOpenState";

export function useBudgetEditorDialogController(
  props: BudgetEditorDialogProps
) {
  const [editingId, setEditingId] = useBudgetEditorDialogVariableOpenState();

  const budgets = useStoreState((_) => _.budgets.items);

  const budget = useMemo(() => {
    return budgets.find((_) => _.id === editingId);
  }, [budgets, editingId]);

  const handleClose = useCallback(() => {
    setEditingId(null);
  }, [setEditingId]);

  return {
    isOpen: !!budget,
    budget,
    handleClose,
  };
}
