import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useSchedulesManagerOpenState() {
  return useOpenQueryState(ComponentState.keys.SchedulesManager);
}
