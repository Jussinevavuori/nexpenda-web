import { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useShortcut } from "./useShortcut";

export function useDeleteTransactionsShortcut() {
  const isApplicationActive = useIsApplicationActive();

  const selectedIds = useStoreState((_) => _.selection.selectionIds);

  const deleteTransactions = useStoreActions(
    (_) => _.transactions.deleteTransactions
  );

  const handler = useCallback(() => {
    if (!isApplicationActive) return;
    deleteTransactions(selectedIds);
  }, [isApplicationActive, selectedIds, deleteTransactions]);

  useShortcut({ key: "D", shift: true }, handler);
}
