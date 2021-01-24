import { useCallback } from "react";
import { useTransactionEditorDrawerVariableOpenState } from "../../components/TransactionEditorDrawer/useTransactionEditorDrawerController";
import { useShortcut } from "./useShortcut";

export function useCloseEditTransactionShortcut() {
  const [, setEditingId] = useTransactionEditorDrawerVariableOpenState();

  const handler = useCallback(() => {
    setEditingId(null);
  }, [setEditingId]);

  useShortcut({ key: "Escape", enableForInputs: true }, handler);
}
