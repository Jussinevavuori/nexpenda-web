import { useAuth } from "../../hooks/application/useAuth";
import { useLockedOutDialogOpenState } from "../../hooks/componentStates/useLockedOutDialogOpenState";
import { PremiumUserLockProps } from "./PremiumUserLock";

export function usePremiumUserLockController(props: PremiumUserLockProps) {
  const user = useAuth();

  const isLocked = props.isLocked && !user?.isPremium;

  const { isOpen: isDialogOpen, setIsOpen: setIsDialogOpen } =
    useLockedOutDialogOpenState();

  return {
    isLocked,

    handleClick() {
      if (isLocked && !props.disableLockedOutDialog) {
        setIsDialogOpen(true);
      }
    },

    isDialogOpen,
    handleDialogOpen() {
      setIsDialogOpen(true);
    },
    handleDialogClose() {
      setIsDialogOpen(false);
    },
  };
}
