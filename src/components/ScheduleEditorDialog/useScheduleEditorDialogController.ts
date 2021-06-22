import { useScheduleEditorOpenState } from "../../hooks/componentStates/useScheduleEditorOpenState";
import { ScheduleEditorDialogProps } from "./ScheduleEditorDialog";

export function useScheduleEditorDialogController(
  props: ScheduleEditorDialogProps
) {
  const { isOpen, openedSchedule, handleClose } = useScheduleEditorOpenState();

  return {
    isOpen,
    openedSchedule,
    handleClose,
  };
}
