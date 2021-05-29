import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useAvatarChangerDialogOpenState() {
  return useBooleanQueryState(
    ComponentState.keys.AvatarChangerDialog,
    "push",
    "open"
  );
}
