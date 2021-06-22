import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { RouteData } from "../../lib/Routing/RouteData";

/**
 * Gets the path level of a part of path, where 0 means no match, 1 means
 * highest level and subsequent integers mean lower levels. For example in the
 * URL. When multiple path parts are provided, returns the highest level when
 * the full path matched.
 *
 * https://nexpenda.com/a/b/c
 *
 * // Default levels
 * usePathLevel("c")   => 1
 * usePathLevel("b")   => 2
 * usePathLevel("a")   => 3
 *
 * // Unfound levels
 * usePathLevel("d")   => 0
 *
 * // Paths
 * usePathLevel("a/b") => 2
 * usePathLevel("b/c") => 1
 *
 * // Unfound paths
 * usePathLevel("a/c") => 0
 * usePathLevel("a/d") => 0
 */
export function usePathLevel(route: string | RouteData): number {
  // Target paths array
  const targetPaths = useMemo(() => {
    const targetPath = typeof route === "string" ? route : route.path;
    return targetPath.split("/").filter(Boolean);
  }, [route]);

  // Paths array from location
  const location = useLocation();
  const urlPaths = useMemo(() => {
    return location.pathname.split("/").filter(Boolean);
  }, [location]);

  return useMemo(() => {
    // Empty URL always matches to highest possible number
    if (targetPaths.length === 0) {
      return urlPaths.length + 1;
    }

    // Find the starting index and ensure full match found
    const offsetIndex = urlPaths.indexOf(targetPaths[0]);
    for (let i = 0; i < targetPaths.length; i++) {
      const targetPathSegment = targetPaths[i];
      const urlPathSegment = urlPaths[i + offsetIndex];
      if (targetPathSegment !== urlPathSegment) {
        return 0;
      }
    }

    // Else match ensured, return highest level match
    return urlPaths.length - (offsetIndex + targetPaths.length - 1);
  }, [targetPaths, urlPaths]);
}
