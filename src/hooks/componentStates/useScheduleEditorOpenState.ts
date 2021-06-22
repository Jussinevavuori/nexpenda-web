import { useMemo, useCallback } from "react";
import { TransactionSchedule } from "../../lib/DataModels/TransactionSchedule";
import { useStoreState } from "../../store";
import { useLocationState } from "../locationState/useLocationState";
import {
  OpenQueryStateOptions,
  useOpenQueryState,
} from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useScheduleEditorOpenState() {
  const {
    isOpen: isStateOpen,
    handleClose: handleStateClose,
    handleOpen: handleStateOpen,
  } = useOpenQueryState(ComponentState.keys.ScheduleEditor);
  const { object } = useLocationState();

  const schedules = useStoreState((_) => _.schedules.items);

  /**
   * Get the opened schedule corresponding to the one specified
   */
  const openedSchedule = useMemo(() => {
    if (object && object.type === "schedule" && object.action === "edit") {
      return schedules.find((b) => b.id === object.id);
    }
    return undefined;
  }, [schedules, object]);

  /**
   * Check if the dialog is open
   */
  const isOpen = useMemo(() => {
    return isStateOpen && !!openedSchedule;
  }, [isStateOpen, openedSchedule]);

  /**
   * Open a schedule for editing
   */
  const handleOpen = useCallback(
    (
      b: TransactionSchedule | string,
      ops?: Omit<OpenQueryStateOptions, "state">
    ) => {
      const id = typeof b === "string" ? b : b.id;
      handleStateOpen({
        ...ops,
        state: { object: { action: "edit", type: "schedule", id } },
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
      openedSchedule,
      openedId: openedSchedule?.id,
      isOpen,
      handleOpen,
      handleClose,
    }),
    [isOpen, openedSchedule, handleOpen, handleClose]
  );
}
