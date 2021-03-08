import { useBooleanQueryState } from "../state/useBooleanQueryState";

export function useIsSearchOpen() {
  return useBooleanQueryState("search", "replace", "open");
}
