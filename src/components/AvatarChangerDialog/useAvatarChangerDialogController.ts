import { useAvatarChangerDialogOpenState } from "../../hooks/componentStates/useAvatarChangerDialogOpenState";
import { AvatarChangerDialogProps } from "./AvatarChangerDialog";

export function useAvatarChangerDialogController(
  props: AvatarChangerDialogProps
) {
  const [isOpen, setIsOpen] = useAvatarChangerDialogOpenState();

  return {
    handleClose() {
      setIsOpen(false);
    },
    isOpen,
  };
}
