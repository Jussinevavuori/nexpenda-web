import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useFreemiumTrackerOpenState() {
  return useOpenQueryState(ComponentState.keys.FreemiumTracker);
}
