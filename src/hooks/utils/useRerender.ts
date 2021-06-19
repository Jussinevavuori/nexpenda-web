import { useCallback, useState } from "react";

export function useRerender() {
  const [, setState] = useState(0);
  return useCallback(() => {
    setState((_) => _ + 1);
  }, [setState]);
}
