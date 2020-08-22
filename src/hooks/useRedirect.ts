import { routes } from "../Routes";
import { useHistory } from "react-router-dom";

export type RouteSelector = (r: typeof routes) => string;

export function useRedirect() {
  const history = useHistory();
  return (path: string | RouteSelector) =>
    history.push(typeof path === "string" ? path : path(routes));
}
