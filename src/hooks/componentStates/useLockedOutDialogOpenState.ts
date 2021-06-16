import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useLockedOutDialogOpenState() {
  return useOpenQueryState(ComponentState.keys.LocketOutDialog);
}
