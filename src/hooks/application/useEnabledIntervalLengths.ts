import { useMemo } from "react";
import { ALL_VALID_INTERVAL_LENGTH_TYPES } from "../../models/interval.model";
import { useRouteData } from "./useRouteData";

/**
 * Depending on the current routeData, checks which interval lengths are
 * enabled for the current page.
 *
 * @returns List of enabled interval lengths
 */
export function useEnabledIntervalLengths() {
  const routeData = useRouteData();

  return useMemo(() => {
    return ALL_VALID_INTERVAL_LENGTH_TYPES.filter((lt) => {
      if (!routeData) return true;
      return routeData.isIntervalLengthEnabled(lt);
    });
  }, [routeData]);
}
