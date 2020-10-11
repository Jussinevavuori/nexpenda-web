import { useCallback, useRef, useState } from "react";

export function useDelayedAction(
  callback: () => void,
  options: {
    delayInMs: number;
    onStart?(): void;
    onCancel?(): void;
  }
) {
  const { delayInMs, onStart, onCancel } = options;

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
    if (onStart) {
      onStart();
    }
    setActive(true);
    timeout.current = setTimeout(() => {
      callback();
      setActive(false);
      timeout.current = null;
    }, delayInMs);
  }, [callback, setActive, timeout, delayInMs, onStart]);

  /**
   * Function to cancel the active timeout
   */
  const cancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    setActive(false);
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, [setActive, timeout, onCancel]);

  return { active, start, cancel };
}
