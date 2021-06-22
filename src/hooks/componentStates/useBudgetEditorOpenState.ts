import { useMemo, useCallback } from "react";
import { Budget } from "../../lib/DataModels/Budget";
import { useStoreState } from "../../store";
import { useLocationState } from "../locationState/useLocationState";
import {
  OpenQueryStateOptions,
  useOpenQueryState,
} from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useBudgetEditorOpenState() {
  const {
    isOpen: isStateOpen,
    handleClose: handleStateClose,
    handleOpen: handleStateOpen,
  } = useOpenQueryState(ComponentState.keys.BudgetEditor);
  const { object } = useLocationState();

  const budgets = useStoreState((_) => _.budgets.items);

  /**
   * Get the opened budget corresponding to the one specified
   */
  const openedBudget = useMemo(() => {
    if (object && object.type === "budget" && object.action === "edit") {
      return budgets.find((b) => b.id === object.id);
    }
    return undefined;
  }, [budgets, object]);

  /**
   * Check if the dialog is open
   */
  const isOpen = useMemo(() => {
    return isStateOpen && !!openedBudget;
  }, [isStateOpen, openedBudget]);

  /**
   * Open a budget for editing
   */
  const handleOpen = useCallback(
    (b: Budget | string, ops?: Omit<OpenQueryStateOptions, "state">) => {
      const id = typeof b === "string" ? b : b.id;
      handleStateOpen({
        ...ops,
        state: { object: { action: "edit", type: "budget", id } },
      });
    },
    [handleStateOpen]
  );

  /**
   * Close the editor
   */
  const handleClose = useCallback(() => {
    handleStateClose();
  }, [handleStateClose]);

  /**
   * Return all information in a memorized reference
   */
  return useMemo(
    () => ({
      openedBudget,
      openedId: openedBudget?.id,
      isOpen,
      handleOpen,
      handleClose,
    }),
    [isOpen, openedBudget, handleOpen, handleClose]
  );
}
