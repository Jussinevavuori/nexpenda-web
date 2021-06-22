import { useSchedulesManagerOpenState } from "../../hooks/componentStates/useSchedulesManagerOpenState";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { SchedulesManagerDrawerProps } from "./SchedulesManagerDrawer";

export function useSchedulesManagerDrawerController(
  props: SchedulesManagerDrawerProps
) {
  const { isOpen, handleClose } = useSchedulesManagerOpenState();
  const isDesktop = useMdMedia();

  return {
    isDesktop,
    isOpen,
    handleClose,
  };
}
