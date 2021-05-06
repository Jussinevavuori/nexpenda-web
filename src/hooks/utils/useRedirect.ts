import { routes } from "../../Routes";
import { useHistory } from "react-router-dom";
import { RouteData } from "../../classes/RouteData";
import { useCallback } from "react";

export type RouteSelector = (r: typeof routes) => RouteData | string;

export function useRedirect() {
  const history = useHistory();

  return useCallback(
    (route: string | RouteData | RouteSelector) => {
      const target = typeof route === "function" ? route(routes) : route;

      const path = typeof target === "string" ? target : target.path;

      history.push(path);
    },
    [history]
  );
}
