import { useQueryMenuState } from "../state/useQueryMenuState";
import { ComponentState } from "./ComponentState";

export function useUserMenuOpenState() {
  return useQueryMenuState(ComponentState.keys.UserMenu, "push");
}
