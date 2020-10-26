import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";

export function useVariableHashOpenState(
  targetHash: string
): [null | string, (value: null | string) => void] {
  const history = useHistory();
  const location = useLocation();

  if (targetHash.includes("@")) {
    throw new Error("Hash cannot include '@' character");
  }

  const value = useMemo(() => {
    const [hash, value] = location.hash.substring(1).split("@");
    if (hash === targetHash && typeof value === "string") {
      return value;
    } else {
      return null;
    }
  }, [location, targetHash]);

  const setValue = useCallback(
    (target: string | null) => {
      if (typeof target === "string") {
        const hash = `${targetHash}@${target}`;
        if (value === null) {
          history.push({ hash });
        } else {
          history.replace({ hash });
        }
      } else {
        if (value !== null) {
          history.goBack();
        }
      }
    },
    [history, targetHash, value]
  );

  return [value, setValue];
}
