import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import {
  LocationState,
  locationStateSchema,
} from "../../lib/LocationState/locationStateSchema";

/**
 * Access the location which is validated to have the shape defined by
 * location state schema.
 */
export function useLocationState() {
  const location = useLocation();

  return useMemo((): LocationState => {
    const parseResult = locationStateSchema.safeParse(location.state);

    // When succesful parse, return location state
    if (parseResult.success) {
      return parseResult.data;
    }

    // On failure return empty objec
    return {};
  }, [location]);
}
