import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useFeedbackDialogOpenState() {
  return useBooleanQueryState(
    ComponentState.keys.FeedbackDialog,
    "push",
    "open"
  );
}
