import { useMemo } from "react";
import { useLocation } from "react-router-dom";
/**
 * Tells whether the user has the main application active (not for example auth page)
 */

export function useIsApplicationActive() {
  const location = useLocation();

  return useMemo(() => Boolean(location.pathname.match(/app/g)), [location]);
}
