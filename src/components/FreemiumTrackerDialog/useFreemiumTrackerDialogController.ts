import { useFreemiumTrackerOpenState } from "../../hooks/componentStates/useFreemiumTrackerOpenState";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { useStoreState } from "../../store";
import { FreemiumTrackerDialogProps } from "./FreemiumTrackerDialog";

export function useFreemiumTrackerDialogController(
  props: FreemiumTrackerDialogProps
) {
  const { isOpen, setIsOpen } = useFreemiumTrackerOpenState();

  const redirect = useRedirect();

  const config = useStoreState((_) => _.appConfig.value);

  return {
    handleClose() {
      setIsOpen(false);
    },
    handleUpgrade() {
      redirect((_) => _.subscribe);
    },
    isOpen,
    config,
  };
}
