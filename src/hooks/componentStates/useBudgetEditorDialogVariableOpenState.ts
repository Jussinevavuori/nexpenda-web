import { useQueryState } from "../state/useQueryState";
import { ComponentState } from "./ComponentState";

const prefix = "edit__";

export function useBudgetEditorDialogVariableOpenState() {
  return useQueryState<null | string>({
    key: ComponentState.keys.BudgetEditorDialog,
    method: "replace",
    decode(value) {
      return value && typeof value === "string" && value.startsWith(prefix)
        ? value.replace(prefix, "")
        : null;
    },
    encode(id) {
      return id ? prefix + id : undefined;
    },
  });
}
