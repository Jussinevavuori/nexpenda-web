import { useCallback } from "react";
import { useStoreState } from "../../store";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useTransactionEditorOpenState } from "../componentStates/useTransactionEditorOpenState";
import { useShortcut } from "./useShortcut";

export function useEditTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();

  // Get the currently selected id (only if one id selected)
  const selection = useStoreState((_) => _.selection.selectionIds);
  const onlySelectedId = selection.length === 1 ? selection[0] : undefined;

  // Use the editor state
  const { isOpen, handleClose, handleOpen } = useTransactionEditorOpenState();

  // Handler to toggle
  const handler = useCallback(() => {
    if (!isApplicationActive) return;
    if (isOpen) {
      handleClose();
    } else if (onlySelectedId) {
      handleOpen(onlySelectedId);
    }
  }, [isApplicationActive, isOpen, handleOpen, handleClose, onlySelectedId]);

  useShortcut({ key: "E", shift: true }, handler);
}
