import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export default function useLongPress(
  callback: () => void,
  options?: {
    pressTimeInMs?: number;
    disableVibrate?: boolean;
  }
) {
  /**
   * Default press time in MS to 500 unless overridden in options
   */
  const pressTimeInMs = useMemo(() => {
    if (options?.pressTimeInMs) {
      return options.pressTimeInMs;
    }
    return 500;
  }, [options]);

  /**
   * Default to enabled vibrate unless disabled in options
   */
  const disableVibrate = useMemo(() => {
    if (options?.disableVibrate) {
      return true;
    }
    return false;
  }, [options]);

  /**
   * Is the press currently occuring
   */
  const [pressed, setPressed] = useState(false);

  /**
   * Referencce to long press timeout
   */
  const timeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start long press function
   */
  const startLongPress = useCallback(() => {
    // Clear any previous timeouts
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    // Set pressed state to true
    setPressed(true);

    // Set new timeout
    timeout.current = setTimeout(() => {
      callback();
      setPressed(false);
      if (!disableVibrate) {
        window.navigator.vibrate(200);
      }
    }, pressTimeInMs);
  }, [callback, setPressed, timeout, pressTimeInMs, disableVibrate]);

  /**
   * End long press function
   */
  const endLongPress = useCallback(() => {
    setPressed(false);
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, [setPressed, timeout]);

  /**
   * Cleaning out any timeouts
   */
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return {
    pressed,
    props: {
      onMouseDown: startLongPress,
      onMouseUp: endLongPress,
      onMouseLeave: endLongPress,
      onTouchStart: startLongPress,
      onTouchEnd: endLongPress,
    },
  };
}
