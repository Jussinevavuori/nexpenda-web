import { useBooleanQueryState } from "../state/useBooleanQueryState";

export function useIsLockedOutDialogOpen() {
  return useBooleanQueryState("premium-dialog", "push", "open");
}
