import { useBudgetCreatorOpenState } from "../../hooks/componentStates/useBudgetCreatorOpenState";
import { BudgetCreatorDialogProps } from "./BudgetCreatorDialog";

export function useBudgetCreatorDialogController(
  props: BudgetCreatorDialogProps
) {
  const { isOpen, handleClose, budgetType } = useBudgetCreatorOpenState();

  return {
    variant: budgetType,
    isOpen,
    handleClose,
  };
}
