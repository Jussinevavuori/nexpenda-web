import { useState, useEffect, useRef, useCallback } from "react";

export default function useLongPress(
  callback: () => void,
  pressTimeInMs: number = 300
) {
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
    }, pressTimeInMs);
  }, [callback, setPressed, timeout, pressTimeInMs]);

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
