import { useCallback, useState } from "react";

export function useForceUpdate() {
  const [, setUpdates] = useState(0);

  const forceUpdate = useCallback(() => {
    setUpdates((_) => _ + 1);
  }, [setUpdates]);

  return forceUpdate;
}
