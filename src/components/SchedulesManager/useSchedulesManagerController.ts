import { useMemo } from "react";
import { useStoreState } from "../../store";
import { SchedulesManagerProps } from "./SchedulesManager";

export function useSchedulesManagerController(props: SchedulesManagerProps) {
  const schedules = useStoreState((_) => _.schedules.items);
  const schedulesLoaded = useStoreState((_) => _.schedules.initialized);

  const activeSchedules = useMemo(
    () => schedules.filter((_) => _.schedule.getIsActive()),
    // .sort((a, b) => {
    // (a.schedule.getNextOccurrence()?.getTime() ?? 0) -
    // (b.schedule.getNextOccurrence()?.getTime() ?? 0);
    // }),
    [schedules]
  );

  const inactiveSchedules = useMemo(
    () => schedules.filter((_) => !_.schedule.getIsActive()),
    // .sort((a, b) => {
    // (a.schedule.getNextOccurrence()?.getTime() ?? 0) -
    // (b.schedule.getNextOccurrence()?.getTime() ?? 0);
    // }),
    [schedules]
  );

  return {
    schedules,
    activeSchedules,
    inactiveSchedules,
    schedulesLoaded,
  };
}
