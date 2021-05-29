import { useHashMenuState } from "../state/useHashMenuState";
import { ComponentState } from "./ComponentState";

export function useUserMenuOpenState() {
  return useHashMenuState(ComponentState.keys.UserMenu);
}
