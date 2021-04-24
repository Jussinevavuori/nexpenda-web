import { useMemo } from "react";
import { ALL_VALID_INTERVAL_LENGTH_TYPES } from "../../models/interval.model";
import { useRouteData } from "./useRouteData";

/**
 * Depending on the current routeData, checks which interval lengths are
 * disabled for the current page.
 *
 * @returns List of disabled interval lengths
 */
export function useDisabledIntervalLengths() {
  const routeData = useRouteData();

  return useMemo(() => {
    return ALL_VALID_INTERVAL_LENGTH_TYPES.filter((lt) => {
      if (!routeData) return false;
      return routeData.isIntervalLengthDisabled(lt);
    });
  }, [routeData]);
}
