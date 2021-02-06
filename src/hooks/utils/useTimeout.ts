import { useCallback, useEffect, useRef } from "react";

export function useTimeout(
  callback: () => void,
  timeoutInMs: number
): [React.MutableRefObject<NodeJS.Timeout | null>, () => void] {
  /**
   * Reference to timeout after creation for canceling it
   */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Creating a new timeout with given callback each time callback or
   * timeoutInMs changes.
   */
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(callback, timeoutInMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [callback, timeoutInMs, timeoutRef]);

  /**
   * Function to cancel active timeout
   */
  const cancelTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timeoutRef]);

  return [timeoutRef, cancelTimeout];
}
