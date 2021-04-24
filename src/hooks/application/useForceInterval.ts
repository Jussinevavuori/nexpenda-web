import { useEffect } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { useEnabledIntervalLengths } from "./useEnabledIntervalLengths";

/**
 * Forces the current interval to be in the list of enabled interval lengths
 */
export function useForceInterval() {
  // State
  const enabledIntervalLengths = useEnabledIntervalLengths();
  const currentIntervalLength = useStoreState((_) => _.interval.lengthType);

  // Actions
  const toMonth = useStoreActions((_) => _.interval.monthInterval);
  const toYear = useStoreActions((_) => _.interval.yearInterval);
  const toAll = useStoreActions((_) => _.interval.allInterval);

  useEffect(
    function forceIntervalLengthToEnabled() {
      // If current interval length is invalid or not enabled, change it
      // to any enabled interval length available
      if (
        currentIntervalLength === "invalid" ||
        !enabledIntervalLengths.includes(currentIntervalLength)
      ) {
        if (enabledIntervalLengths.includes("month")) {
          toMonth();
        } else if (enabledIntervalLengths.includes("year")) {
          toYear();
        } else if (enabledIntervalLengths.includes("all")) {
          toAll();
        } else {
          throw new Error(
            `Could not force interval length due to empty enabledIntervalLengths`
          );
        }
      }
    },
    [enabledIntervalLengths, currentIntervalLength, toMonth, toYear, toAll]
  );
}
