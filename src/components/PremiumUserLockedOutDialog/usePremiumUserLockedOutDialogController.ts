import { useLockedOutDialogOpenState } from "../../hooks/componentStates/useLockedOutDialogOpenState";
import { PremiumUserLockedOutDialogProps } from "./PremiumUserLockedOutDialog";

export function usePremiumUserLockedOutDialogController(
  props: PremiumUserLockedOutDialogProps
) {
  const { isOpen, handleClose } = useLockedOutDialogOpenState();

  return {
    isOpen,
    handleClose,
  };
}
