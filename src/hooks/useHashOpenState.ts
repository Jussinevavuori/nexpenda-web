import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";

export function useHashOpenState(
  targetHash: string
): [boolean, (value: boolean) => void] {
  const history = useHistory();
  const location = useLocation();

  if (targetHash.includes("@")) {
    throw new Error("Hash cannot include '@' character");
  }

  const open = useMemo(() => {
    return location.hash.substring(1) === targetHash;
  }, [location, targetHash]);

  const setOpen = useCallback(
    (target: boolean) => {
      if (target === true) {
        if (!open) {
          history.push({ hash: targetHash });
        }
      } else {
        if (open) {
          history.goBack();
        }
      }
    },
    [history, targetHash, open]
  );

  return [open, setOpen];
}
