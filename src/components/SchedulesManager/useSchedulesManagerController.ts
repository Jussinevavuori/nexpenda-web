import { useStoreState } from "../../store";
import { SchedulesManagerProps } from "./SchedulesManager";

export function useSchedulesManagerController(props: SchedulesManagerProps) {
  const schedules = useStoreState((_) => _.schedules.items);

  return {
    schedules,
  };
}
