import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  HTMLProps,
} from "react";
import { useVibration } from "./useVibration";

export default function useLongPress(
  callback: () => void,
  options?: {
    pressTimeInMs?: number;
    disableVibrate?: boolean;
    shouldPreventDefault?: boolean;
  }
): {
  pressed: boolean;
  props: Partial<HTMLProps<HTMLDivElement>>;
  childlockProps: Partial<HTMLProps<HTMLDivElement>>;
} {
  /**
   * Vibration
   */
  const vibrate = useVibration();

  /**
   * Default press time in MS to 500 unless overridden in options
   */
  const pressTimeInMs = useMemo(() => {
    if (options?.pressTimeInMs !== undefined) {
      return options.pressTimeInMs;
    }
    return 300;
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
   * Default to prevent default
   */
  const shouldPreventDefault = useMemo(() => {
    if (options?.shouldPreventDefault === false) {
      return false;
    }
    return true;
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
   * Latest click position
   */
  const origin = useRef<null | { x: number; y: number }>(null);

  /**
   * Start long press function
   */
  const startLongPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
      if (shouldPreventDefault) {
        e.preventDefault();
      }

      // Set latest start position
      if ("clientX" in e && "clientY" in e) {
        origin.current = {
          x: e.clientX,
          y: e.clientY,
        };
      } else {
        if (e.touches.length > 1) {
          return;
        } else {
          const touch = e.touches[0];
          origin.current = {
            x: touch.clientX,
            y: touch.clientY,
          };
        }
      }

      // Clear any previous timeouts
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      // Set pressed state to true
      setPressed(true);

      // Set new timeout
      timeout.current = setTimeout(() => {
        callback();
        if (!disableVibrate) {
          vibrate("default");
        }
      }, pressTimeInMs);
    },
    [
      shouldPreventDefault,
      callback,
      setPressed,
      timeout,
      pressTimeInMs,
      disableVibrate,
      vibrate,
    ]
  );

  /**
   * End long press function
   */
  const endLongPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
      if (shouldPreventDefault) {
        e.preventDefault();
      }

      origin.current = null;

      setPressed(false);

      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    },
    [shouldPreventDefault, setPressed, timeout]
  );

  /**
   * Disable the current long press (still show as pressed),
   * for example when user scrolls
   */
  const cancelLongPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
      if (shouldPreventDefault) {
        e.preventDefault();
      }

      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    },
    [shouldPreventDefault, timeout]
  );

  /**
   * Handle move: do not cancel on small movements
   */
  const cancelLongPressOnMove = useCallback(
    (e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
      let x = 0;
      let y = 0;

      if (!origin.current) {
        return;
      }

      if ("touches" in e) {
        if (e.touches.length > 1) {
          cancelLongPress(e);
        } else {
          x = e.touches[0].clientX;
          y = e.touches[0].clientY;
        }
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      /**
       * Calculate distance from touch origin
       */
      const dx = x - origin.current.x;
      const dy = y - origin.current.y;
      const d2 = dx * dx + dy * dy;

      if (d2 > movementCancelThreshold) {
        cancelLongPress(e);
      }
    },
    [cancelLongPress]
  );

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
      onTouchStart: startLongPress,
      onTouchEnd: endLongPress,
      onTouchMove: cancelLongPressOnMove,
      onTouchCancel: cancelLongPress,

      onMouseDown: startLongPress,
      onMouseUp: endLongPress,
      onMouseLeave: endLongPress,
      onMouseOut: endLongPress,
    },
    childlockProps: {
      onTouchStart: (e) => e.stopPropagation(),
      onTouchEnd: (e) => e.stopPropagation(),
      onTouchMove: (e) => e.stopPropagation(),
      onTouchCancel: (e) => e.stopPropagation(),

      onMouseDown: (e) => e.stopPropagation(),
      onMouseUp: (e) => e.stopPropagation(),
      onMouseLeave: (e) => e.stopPropagation(),
      onMouseOut: (e) => e.stopPropagation(),
    },
  };
}

const movementCancelThresholdInPx = 10;
const movementCancelThreshold =
  movementCancelThresholdInPx * movementCancelThresholdInPx;
