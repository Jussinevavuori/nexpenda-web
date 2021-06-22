import { useMemo, useCallback } from "react";
import { Budget } from "../../lib/DataModels/Budget";
import { useLocationState } from "../locationState/useLocationState";
import {
  OpenQueryStateOptions,
  useOpenQueryState,
} from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useBudgetCreatorOpenState() {
  const {
    isOpen: isStateOpen,
    handleClose: handleStateClose,
    handleOpen: handleStateOpen,
  } = useOpenQueryState(ComponentState.keys.BudgetCreator);
  const { object } = useLocationState();

  /**
   * Get the opened budget corresponding to the one specified
   */
  const budgetType: Budget["type"] | undefined = useMemo(():
    | Budget["type"]
    | undefined => {
    if (object && object.type === "budget" && object.action === "create") {
      if (object.id === "income" || object.id === "expense") {
        return object.id;
      }
    }
    return undefined;
  }, [object]);

  /**
   * Check if the dialog is open
   */
  const isOpen = useMemo(() => {
    return isStateOpen && !!budgetType;
  }, [isStateOpen, budgetType]);

  /**
   * Open a budget for editing
   */
  const handleOpen = useCallback(
    (type: Budget["type"], ops?: Omit<OpenQueryStateOptions, "state">) => {
      handleStateOpen({
        ...ops,
        state: { object: { action: "create", type: "budget", id: type } },
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
      // Fix this later:
      // For some reason budgetType is correctly typed as
      // "income" | "expense" | undefined even in the dependencies array,
      // however it loses its specificity and becomes string | undefined
      // when passed to the object as just budgetType. This fixes it.
      budgetType: budgetType as typeof budgetType,
      isOpen,
      handleOpen,
      handleClose,
    }),
    [isOpen, budgetType, handleOpen, handleClose]
  );
}
