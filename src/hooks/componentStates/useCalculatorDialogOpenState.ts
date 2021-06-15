import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useCalculatorDialogOpenState() {
  return useBooleanQueryState(ComponentState.keys.Calculator, "push", "open");
}
