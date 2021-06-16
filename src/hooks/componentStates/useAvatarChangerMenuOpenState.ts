import { useOpenMenuQueryState } from "../state/useOpenMenuQueryState";
import { ComponentState } from "./ComponentState";

export function useAvatarChangerMenuOpenState() {
  return useOpenMenuQueryState(ComponentState.keys.AvatarChangerMenu);
}
