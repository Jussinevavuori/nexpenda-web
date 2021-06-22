import { routes } from "../../Routes";
import { useHistory } from "react-router-dom";
import { RouteData } from "../../lib/Routing/RouteData";
import { useCallback } from "react";

export type RouteSelector = (r: typeof routes) => RouteData | string;

export function useRedirect() {
  const history = useHistory();

  return useCallback(
    (
      route: string | RouteData | RouteSelector,
      method: "push" | "replace" = "push"
    ) => {
      const target = typeof route === "function" ? route(routes) : route;

      const path = typeof target === "string" ? target : target.path;

      history[method](path);
    },
    [history]
  );
}
