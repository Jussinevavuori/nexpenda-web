import { useCallback } from "react";
import { useBudgetCreatorDialogVariableOpenState } from "../../hooks/componentStates/useBudgetCreatorDialogVariableOpenState";
import { BudgetCreatorDialogProps } from "./BudgetCreatorDialog";

export function useBudgetCreatorDialogController(
  props: BudgetCreatorDialogProps
) {
  const [state, setState] = useBudgetCreatorDialogVariableOpenState();

  const handleClose = useCallback(() => {
    setState(undefined);
  }, [setState]);

  return {
    variant: state,
    isOpen: !!state,
    handleClose,
  };
}
