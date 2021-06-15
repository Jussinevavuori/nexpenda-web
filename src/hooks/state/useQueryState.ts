import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import {
  parse as parseQueryString,
  stringify as createQueryString,
} from "query-string";

export function useQueryState<T>(options: {
  key: string;
  method: "push" | "replace";
  decode: (encoded: string | string[] | null) => T;
  encode: (decoded: T) => string | null | undefined;
}): [T, (t: T) => void] {
  const { key, decode, encode, method } = options;
  const location = useLocation();
  const history = useHistory();

  /**
   * Get current state from the query string
   */
  const state = useMemo(() => {
    const search = location.search;
    const query = parseQueryString(search);
    const value = query[key];
    return decode(value);
  }, [location, decode, key]);

  /**
   * Function to set the state to the query string
   */
  const setState = useCallback(
    function (target: T) {
      const query = parseQueryString(location.search);
      const queryString = createQueryString({
        ...query,
        [key]: encode(target),
      });

      switch (method) {
        case "push":
          history.push({ search: queryString });
          break;
        case "replace":
          history.replace({ search: queryString });
          break;
        default:
          break;
      }
    },
    [encode, key, location, history, method]
  );

  /**
   * Return the same signature as the useState hook
   */
  return [state, setState];
}
