import { useQueryState } from "../state/useQueryState";
import { ComponentState } from "./ComponentState";

const prefix = "create__";

export function useBudgetCreatorDialogVariableOpenState() {
  return useQueryState<"income" | "expense" | undefined>({
    key: ComponentState.keys.BudgetCreatorDialog,
    method: "push",
    encode(val) {
      if (val) {
        return prefix + val;
      } else {
        return undefined;
      }
    },
    decode(val) {
      switch (val) {
        case prefix + "income":
          return "income";
        case prefix + "expense":
          return "expense";
        default:
          return undefined;
      }
    },
  });
}
