import { useEffect, useRef } from "react";

export function useMountedRef() {
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, [mountedRef]);

  return mountedRef;
}
