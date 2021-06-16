import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useAvatarChangerOpenState() {
  return useOpenQueryState(ComponentState.keys.AvatarChanger);
}
