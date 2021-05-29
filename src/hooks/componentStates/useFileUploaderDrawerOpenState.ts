import { useBooleanQueryState } from "../state/useBooleanQueryState";
import { ComponentState } from "./ComponentState";

export function useFileUploaderDrawerOpenState() {
  return useBooleanQueryState(
    ComponentState.keys.FileUploaderDrawer,
    "push",
    "open"
  );
}
