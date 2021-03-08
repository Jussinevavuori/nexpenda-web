import { useIsLockedOutDialogOpen } from "../../hooks/application/useIsLockedOutDialogOpen";
import { PremiumUserLockProps } from "./PremiumUserLock";

export function usePremiumUserLockController(props: PremiumUserLockProps) {
  const isLocked = props.isLocked;

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
