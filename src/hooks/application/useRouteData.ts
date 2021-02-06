import { useLocation } from "react-router-dom";
import { RouteData, routes, VariableRouteData } from "../../Routes";

export function useRouteData(): RouteData | undefined {
  const location = useLocation();

  const current = Object.entries(routes)
    .map((entry) => {
      const [, value] = entry as [string, RouteData | VariableRouteData];
      return typeof value === "function" ? value(".*") : value;
    })
    .find((route) => {
      const routeRegexp = new RegExp(route.path + "$");
      return !!location.pathname.match(routeRegexp);
    });

  return current;
}
