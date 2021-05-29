import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useIsLockedOutDialogOpen() {
  return useBooleanQueryState(
    ComponentState.keys.LocketOutDialog,
    "push",
    "open"
  );
}
