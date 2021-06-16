import { useAvatarChangerOpenState } from "../../hooks/componentStates/useAvatarChangerOpenState";
import { AvatarChangerDialogProps } from "./AvatarChangerDialog";

export function useAvatarChangerDialogController(
  props: AvatarChangerDialogProps
) {
  const { isOpen, handleClose } = useAvatarChangerOpenState();

  return {
    handleClose,
    isOpen,
  };
}
