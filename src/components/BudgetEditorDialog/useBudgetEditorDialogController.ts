import { BudgetEditorDialogProps } from "./BudgetEditorDialog";
import { useBudgetEditorOpenState } from "../../hooks/componentStates/useBudgetEditorOpenState";

export function useBudgetEditorDialogController(
  props: BudgetEditorDialogProps
) {
  const { isOpen, openedBudget, handleClose } = useBudgetEditorOpenState();

  return {
    isOpen,
    budget: openedBudget,
    handleClose,
  };
}
