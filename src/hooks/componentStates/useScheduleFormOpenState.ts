import { useOpenMenuQueryState } from "../state/useOpenMenuQueryState";
import { ComponentState } from "./ComponentState";

export function useScheduleFormOpenState() {
  return useOpenMenuQueryState(ComponentState.keys.ScheduleForm);
}
