import { useQueryState } from "../state/useQueryState";
import { ComponentState } from "./ComponentState";

export function useBudgetBlockMenuVariableOpenState() {
  return useQueryState<null | string>({
    key: ComponentState.keys.BudgetBlockMenu,
    method: "push",
    decode(value) {
      return value && typeof value === "string" && value.startsWith("menu--")
        ? value.replace("menu--", "")
        : null;
    },
    encode(id) {
      return id ? `menu--${id}` : undefined;
    },
  });
}
