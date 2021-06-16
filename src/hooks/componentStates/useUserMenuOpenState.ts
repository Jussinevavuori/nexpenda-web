import { useOpenMenuQueryState } from "../state/useOpenMenuQueryState";
import { ComponentState } from "./ComponentState";

export function useUserMenuOpenState() {
  return useOpenMenuQueryState(ComponentState.keys.UserMenu);
}
