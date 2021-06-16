import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useFeedbackOpenState() {
  return useOpenQueryState(ComponentState.keys.FeedbackDialog);
}
