import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useCalculatorOpenState() {
  return useOpenQueryState(ComponentState.keys.Calculator);
}
