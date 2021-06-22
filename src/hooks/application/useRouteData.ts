import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { RouteData } from "../../lib/Routing/RouteData";
import { routes } from "../../Routes";

export function useRouteData(): RouteData | undefined {
  const location = useLocation();
  const pathname = location.pathname;

  /**
   * Get all routes. Apply the ".*" parameter for all variable routes.
   * Find one route data that matches the current pathname.
   */
  return useMemo(() => {
    return Object.values(routes)
      .map((route) => (typeof route === "function" ? route(".*") : route))
      .find((route) => route.matchesPathname(pathname));
  }, [pathname]);
}
