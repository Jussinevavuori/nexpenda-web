import { useAuth } from "../../hooks/application/useAuth";
import { useIsLockedOutDialogOpen } from "../../hooks/componentStates/useIsLockedOutDialogOpen";
import { PremiumUserLockProps } from "./PremiumUserLock";

export function usePremiumUserLockController(props: PremiumUserLockProps) {
  const user = useAuth();

  const isLocked = props.isLocked && !user?.isPremium;

  const [isDialogOpen, setIsDialogOpen] = useIsLockedOutDialogOpen();

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
