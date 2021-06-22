import { useOpenQueryState } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useScheduleCreatorOpenState() {
  return useOpenQueryState(ComponentState.keys.ScheduleCreator);
}
