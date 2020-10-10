import { useCallback, useRef, useState } from "react";

export function useDelayedAction(callback: () => void, delayInMs: number) {
  /**
   * Timeout ref
   */
  const timeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Is the current timeout active
   */
  const [active, setActive] = useState(false);

  /**
   * Function to start and set the timeout to call the callback function
   */
  const start = useCallback(() => {
    setActive(true);
    timeout.current = setTimeout(() => {
      callback();
      setActive(false);
      timeout.current = null;
    }, delayInMs);
  }, [callback, setActive, timeout, delayInMs]);

  /**
   * Function to cancel the active timeout
   */
  const cancel = useCallback(() => {
    setActive(false);
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, [setActive, timeout]);

  return { active, start, cancel };
}
