import { useCallback } from "react";
import { useStoreState } from "../../store";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useTransactionCopy } from "../application/useTransactionCopy";
import { useShortcut } from "./useShortcut";

export function useCopyTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();
  const selection = useStoreState((_) => _.selection.selection);

  const copyTransaction = useTransactionCopy();

  const handler = useCallback(() => {
    if (!isApplicationActive) return;
    if (selection.length !== 1) return;
    copyTransaction(selection[0]);
  }, [isApplicationActive, selection, copyTransaction]);

  useShortcut({ key: "C", shift: true }, handler);
}
