import { useCallback } from "react";
import { useStoreState } from "../../store";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useTransactionEditorDrawerVariableOpenState } from "../componentStates/useTransactionEditorDrawerVariableOpenState";
import { useShortcut } from "./useShortcut";

export function useEditTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();

  // Get the currently selected id (only if one id selected)
  const selection = useStoreState((_) => _.selection.selectionIds);
  const onlySelectedId = selection.length === 1 ? selection[0] : undefined;

  // Use the editor state
  const [isEditingId, setIsEditingId] =
    useTransactionEditorDrawerVariableOpenState();

  // Handler to toggle
  const handler = useCallback(() => {
    if (!isApplicationActive) return;
    if (isEditingId) {
      setIsEditingId(null);
    } else if (onlySelectedId) {
      setIsEditingId(onlySelectedId);
    }
  }, [isApplicationActive, isEditingId, setIsEditingId, onlySelectedId]);

  useShortcut({ key: "E", shift: true }, handler);
}
