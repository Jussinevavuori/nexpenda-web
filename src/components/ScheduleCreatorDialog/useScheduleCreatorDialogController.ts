import { useScheduleCreatorOpenState } from "../../hooks/componentStates/useScheduleCreatorOpenState";
import { ScheduleCreatorDialogProps } from "./ScheduleCreatorDialog";

export function useScheduleCreatorDialogController(
  props: ScheduleCreatorDialogProps
) {
  const { isOpen, handleClose } = useScheduleCreatorOpenState();

  return {
    isOpen,
    handleClose,
  };
}
