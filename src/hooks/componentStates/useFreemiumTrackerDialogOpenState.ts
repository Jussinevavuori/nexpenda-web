import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useFreemiumTrackerDialogOpenState() {
  return useBooleanQueryState(
    ComponentState.keys.FreemiumTrackerDialog,
    "push",
    "open"
  );
}
