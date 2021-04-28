import { useCallback } from "react";
import { useQueryState } from "../../hooks/state/useQueryState";
import { BudgetCreatorDialogProps } from "./BudgetCreatorDialog";

export const BudgetCreatorDialogOpenHash = "budget";

export function useBudgetCreatorDialogVariableOpenState() {
  return useQueryState<"income" | "expense" | undefined>({
    key: BudgetCreatorDialogOpenHash,
    method: "push",
    encode(val) {
      switch (val) {
        case "income":
          return "create--income";
        case "expense":
          return "create--expense";
        default:
          return undefined;
      }
    },
    decode(val) {
      switch (val) {
        case "create--income":
          return "income";
        case "create--expense":
          return "expense";
        default:
          return undefined;
      }
    },
  });
}

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
