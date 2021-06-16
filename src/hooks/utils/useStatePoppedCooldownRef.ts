import { useEffect, useRef } from "react";

/**
 * This hook returns a ref and will not cause rerenders.
 *
 * This hook listens to popState events and when one occurs it sets the ref
 * value true to signal that a cooldown has started. The ref is reset to false
 * when the cooldown has passed after the specified timeout.
 */
export function useStatePoppedCooldownRef(timeoutMs: number) {
  /**
   * Ref to store state
   */
  const statePopped = useRef(false);

  /**
   * Current cooldown timeout
   */
  const timeout = useRef<number | null>(null);

  /**
   * Listen to pop state events
   */
  useEffect(() => {
    // Cancel previous timeout if new popState occurs before previous cooldown
    // has ended
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    // Set up the listener to set the statePopped ref's value to true and
    // reset it to false after a timeout.
    const listener = (e: PopStateEvent) => {
      statePopped.current = true;
      timeout.current = window.setTimeout(() => {
        statePopped.current = false;
      }, timeoutMs);
    };

    // Set up listener
    window.addEventListener("popstate", listener);

    // Cleanup: clear popstate listeners and timeouts
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
      window.removeEventListener("popstate", listener);
    };
  }, [statePopped, timeoutMs, timeout]);

  return statePopped;
}
