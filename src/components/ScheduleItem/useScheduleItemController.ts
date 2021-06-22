import { isSameDay, differenceInDays, startOfDay, isToday } from "date-fns";
import { useCallback, useMemo } from "react";
import { useScheduleEditorOpenState } from "../../hooks/componentStates/useScheduleEditorOpenState";
import { useStoreActions } from "../../store";
import { ScheduleItemProps } from "./ScheduleItem";

export function useScheduleItemController(props: ScheduleItemProps) {
  const transactionSchedule = props.schedule;
  const schedule = props.schedule.schedule;

  const { handleOpen } = useScheduleEditorOpenState();

  const handleEditSchedule = useCallback(() => {
    handleOpen(transactionSchedule);
  }, [handleOpen, transactionSchedule]);

  const deleteSchedule = useStoreActions((_) => _.schedules.deleteSchedule);

  const handleDeleteSchedule = useCallback(async () => {
    return deleteSchedule({
      id: transactionSchedule.id,
      deleteTransactions: false,
    });
  }, [deleteSchedule, transactionSchedule]);

  const isActive = useMemo(() => schedule.getIsActive(), [schedule]);

  const firstOccurrence = useMemo(() => schedule.firstOccurrence, [schedule]);

  const nextOccurrence = useMemo(
    () => schedule.getNextOccurrence(),
    [schedule]
  );

  const previousOccurrence = useMemo(
    () => schedule.getPreviousOccurrence(),
    [schedule]
  );

  const lastOccurrence = useMemo(
    () => schedule.getLastOccurrence(),
    [schedule]
  );

  const firstIsPrevious = useMemo(
    () => previousOccurrence && isSameDay(firstOccurrence, previousOccurrence),
    [firstOccurrence, previousOccurrence]
  );

  const isOccurringToday = useMemo(
    () => previousOccurrence && isToday(previousOccurrence),
    [previousOccurrence]
  );

  const daysBetweenPreviousAndNext = useMemo(
    () =>
      nextOccurrence && previousOccurrence
        ? differenceInDays(
            startOfDay(nextOccurrence),
            startOfDay(previousOccurrence)
          )
        : 0,
    [nextOccurrence, previousOccurrence]
  );

  const daysUntilNext = useMemo(
    () =>
      nextOccurrence
        ? differenceInDays(startOfDay(nextOccurrence), startOfDay(new Date()))
        : 0,
    [nextOccurrence]
  );

  const progressUntilNextPercentage = useMemo(() => {
    if (daysBetweenPreviousAndNext === 0) return 100;
    return (
      (100 * (daysBetweenPreviousAndNext - daysUntilNext)) /
      daysBetweenPreviousAndNext
    );
  }, [daysUntilNext, daysBetweenPreviousAndNext]);

  const nextIsLast = useMemo(
    () =>
      lastOccurrence &&
      nextOccurrence &&
      isSameDay(startOfDay(lastOccurrence), startOfDay(nextOccurrence)),
    [nextOccurrence, lastOccurrence]
  );

  return {
    isActive,
    nextOccurrence,
    previousOccurrence,
    lastOccurrence,
    firstOccurrence,
    firstIsPrevious,
    nextIsLast,
    daysBetweenPreviousAndNext,
    daysUntilNext,
    progressUntilNextPercentage,
    isOccurringToday,
    handleDeleteSchedule,
    handleEditSchedule,
  };
}
