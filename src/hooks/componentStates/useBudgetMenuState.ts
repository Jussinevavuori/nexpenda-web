import { useCallback, useMemo } from "react";
import { Budget } from "../../lib/DataModels/Budget";
import { useStoreState } from "../../store";
import { useLocationState } from "../locationState/useLocationState";
import { useOpenMenuQueryState } from "../state/useOpenMenuQueryState";
import { OpenQueryStateOptions } from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useBudgetMenuState() {
  const {
    isOpen: isStateOpen,
    anchorEl,
    handleOpen: handleStateOpen,
    handleClose: handleStateClose,
  } = useOpenMenuQueryState(ComponentState.keys.BudgetMenu);
  const { object } = useLocationState();

  const budgets = useStoreState((_) => _.budgets.items);

  /**
   * Get the targeted budget corresponding to the one specified
   */
  const targetBudget = useMemo(() => {
    if (object && object.type === "budget" && object.action === "select") {
      return budgets.find((b) => b.id === object.id);
    }
    return undefined;
  }, [budgets, object]);

  /**
   * Check whether the menu is open
   */
  const isOpen = useMemo(() => {
    return targetBudget && isStateOpen;
  }, [targetBudget, isStateOpen]);

  /**
   * Open the menu to a budget
   */
  const handleOpen = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      b: Budget | string,
      ops?: Omit<OpenQueryStateOptions, "state">
    ) => {
      const id = typeof b === "string" ? b : b.id;
      handleStateOpen(e, {
        ...ops,
        state: {
          object: { action: "select", type: "budget", id },
        },
      });
    },
    [handleStateOpen]
  );

  /**
   * Close the menu
   */
  const handleClose = useCallback(() => {
    handleStateClose();
  }, [handleStateClose]);

  /**
   * Return all information in a memorized reference
   */
  return useMemo(
    () => ({
      anchorEl,
      isOpen,
      targetBudget,
      targetId: targetBudget?.id,
      handleOpen,
      handleClose,
    }),
    [isOpen, targetBudget, anchorEl, handleOpen, handleClose]
  );
}
