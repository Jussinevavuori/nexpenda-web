import { useIsLockedOutDialogOpen } from "../../hooks/componentStates/useIsLockedOutDialogOpen";
import { PremiumUserLockedOutDialogProps } from "./PremiumUserLockedOutDialog";

export function usePremiumUserLockedOutDialogController(
  props: PremiumUserLockedOutDialogProps
) {
  const [isOpen, setIsOpen] = useIsLockedOutDialogOpen();

  function handleClose() {
    setIsOpen(false);
  }

  return {
    isOpen,
    handleClose,
  };
}
