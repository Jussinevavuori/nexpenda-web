import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { ScheduleFormProps } from "./ScheduleForm";

export function useScheduleFormController(props: ScheduleFormProps) {
  const value = props.value;
  const fromDate = props.fromDate;
  const onChange = props.onChange;

  /**
   * Enable and disable ending
   */
  const latestOccurrencesValue = useRef(1);
  useEffect(() => {
    if (value.occurrences > 0) {
      latestOccurrencesValue.current = value.occurrences;
    }
  }, [value]);
  function setIsOccurrencesEnabled(enabled: boolean) {
    if (value.enabled) {
      onChange({
        ...value,
        occurrences: enabled ? latestOccurrencesValue.current : 0,
      });
    }
  }
  const isOccurrencesEnabled = value.enabled && value.occurrences > 0;

  /**
   * Calculate which day the schedule will end if every and occurrences
   * are enabeld.
   */
  const untilDate = useMemo(() => {
    if (value.occurrences > 0 && value.enabled) {
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
  }, [fromDate, value]);

  return {
    untilDate,
    setIsOccurrencesEnabled,
    isOccurrencesEnabled,
  };
}
