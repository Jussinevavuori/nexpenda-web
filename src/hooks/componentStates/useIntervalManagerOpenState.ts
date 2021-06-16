import { useOpenMenuQueryState } from "../state/useOpenMenuQueryState";
import { ComponentState } from "./ComponentState";

export function useIntervalManagerOpenState() {
  return useOpenMenuQueryState(ComponentState.keys.IntervalManager);
}
