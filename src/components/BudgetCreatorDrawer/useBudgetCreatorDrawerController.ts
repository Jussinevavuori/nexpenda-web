import { useCallback } from "react";
import { useQueryState } from "../../hooks/state/useQueryState";
import { BudgetCreatorDrawerProps } from "./BudgetCreatorDrawer";

export const BudgetCreatorDrawerOpenHash = "create-budget";

export function useBudgetCreatorDrawerVariableOpenState() {
  return useQueryState<"income" | "expense" | undefined>({
    key: BudgetCreatorDrawerOpenHash,
    method: "push",
    encode(val) {
      switch (val) {
        case "income":
          return "i";
        case "expense":
          return "e";
        default:
          return undefined;
      }
    },
    decode(val) {
      switch (val) {
        case "i":
          return "income";
        case "e":
          return "expense";
        default:
          return undefined;
      }
    },
  });
}

export function useBudgetCreatorDrawerController(
  props: BudgetCreatorDrawerProps
) {
  const [state, setState] = useBudgetCreatorDrawerVariableOpenState();

  const handleClose = useCallback(() => {
    setState(undefined);
  }, [setState]);

  return {
    variant: state,
    isOpen: !!state,
    handleClose,
  };
}
