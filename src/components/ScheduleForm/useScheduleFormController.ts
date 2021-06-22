import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { useMemo } from "react";
import { ScheduleFormProps } from "./ScheduleForm";

export function useScheduleFormController(props: ScheduleFormProps) {
  const value = props.value;
  const fromDate = props.fromDate;

  const isEnabled = props.value.enabled || props.alwaysEnabled;

  /**
   * Calculate which day the schedule will end if every and occurrences
   * are enabeld.
   */
  const untilDate = useMemo(() => {
    const _getUntilDate = () => {
      if (value.occurrences > 0 && isEnabled) {
        const duration = value.every * value.occurrences - 1;
        switch (value.type) {
          case "DAY": {
            return addDays(fromDate, duration);
          }
          case "WEEK": {
            return addWeeks(fromDate, duration);
          }
          case "MONTH": {
            return addMonths(fromDate, duration);
          }
          case "YEAR": {
            return addYears(fromDate, duration);
          }
        }
      }
    };
    const _date = _getUntilDate();
    return _date
      ? Number.isNaN(_date?.getTime())
        ? undefined
        : _date
      : undefined;
  }, [isEnabled, fromDate, value]);

  return {
    isEnabled,
    untilDate,
  };
}
