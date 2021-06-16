import { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  parse as parseQueryString,
  stringify as createQueryString,
} from "query-string";
import { useStatePoppedCooldownRef } from "../utils/useStatePoppedCooldownRef";
import { LocationState } from "../../utils/LocationState/locationStateSchema";

export type UseOpenQueryStateOptions = {
  truthy?: string;
  enableOnPopStateCooldown?: boolean;
};

export type OpenQueryStateOptions = {
  state?: LocationState;
  replace?: boolean;
};

const defaultTruthyValue = "open";

export function useOpenQueryState(
  key: string,
  options?: UseOpenQueryStateOptions
) {
  const truthy = options?.truthy ?? defaultTruthyValue;
  const enableOnPopStateCooldown = options?.enableOnPopStateCooldown ?? false;

  const location = useLocation();
  const history = useHistory();

  /**
   * Get current state from the query string
   */
  const isOpen = useMemo(() => {
    const search = location.search;
    const query = parseQueryString(search);
    const value = query[key];
    return value === truthy;
  }, [location, truthy, key]);

  /**
   * Cooldown on pop state events
   */
  const isPopStateCooldownActive = useStatePoppedCooldownRef(50);

  /**
   * Set state function that pushes the state on open and pops the state
   * on closing. The setState function can also be passed a LocationState
   * object which performs the setState(true) action and sets the location
   * state.
   */
  const setIsOpen = useCallback(
    (ops: boolean | OpenQueryStateOptions) => {
      // Open
      if (ops) {
        // Get new search string
        const search = createQueryString({
          ...parseQueryString(location.search),
          [key]: truthy,
        });

        // Get the specified state
        const state = typeof ops === "object" ? ops.state : undefined;

        // Get the specified method
        const method =
          typeof ops === "object" && ops.replace ? "replace" : "push";

        // Open with state when state object specified, else open regularly
        history[method]({ search, state });
      }

      // Close unless prevented by recent pop state event
      else {
        // Prevent popping when cooldown active
        if (isPopStateCooldownActive.current && !enableOnPopStateCooldown) {
          return;
        }
        history.goBack();
      }
    },
    [
      key,
      history,
      location,
      truthy,
      enableOnPopStateCooldown,
      isPopStateCooldownActive,
    ]
  );

  // Utility functions
  const handleOpen = useCallback(
    (ops?: OpenQueryStateOptions) => {
      setIsOpen(ops ?? true);
    },
    [setIsOpen]
  );
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  // Return functions in a memorized reference
  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      handleOpen,
      handleClose,
      handleToggle,
    }),
    [isOpen, setIsOpen, handleOpen, handleClose, handleToggle]
  );
}
