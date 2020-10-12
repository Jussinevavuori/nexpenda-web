import { useCallback, useEffect, useRef } from "react";

export function useInterval(
  callback: () => void,
  intervalInMs: number
): [React.MutableRefObject<NodeJS.Timeout | null>, () => void] {
  /**
   * Reference to interval after creation for canceling it
   */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Creating a new interval with given callback each time callback or
   * timeoutInMs changes.
   */
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(callback, intervalInMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, intervalInMs, intervalRef]);

  /**
   * Function to cancel active interval
   */
  const cancelInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [intervalRef]);

  return [intervalRef, cancelInterval];
}
