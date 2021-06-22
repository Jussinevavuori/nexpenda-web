import { useMemo, useCallback } from "react";
import { Transaction } from "../../lib/DataModels/Transaction";
import { useStoreState } from "../../store";
import { useLocationState } from "../locationState/useLocationState";
import {
  OpenQueryStateOptions,
  useOpenQueryState,
} from "../state/useOpenQueryState";
import { ComponentState } from "./ComponentState";

export function useTransactionEditorOpenState() {
  const {
    isOpen: isStateOpen,
    handleClose: handleStateClose,
    handleOpen: handleStateOpen,
  } = useOpenQueryState(ComponentState.keys.TransactionEditor);
  const { object } = useLocationState();

  const transactions = useStoreState((_) => _.transactions.items);

  /**
   * Get the opened transaction corresponding to the one specified
   */
  const openedTransaction = useMemo(() => {
    if (object && object.type === "transaction" && object.action === "edit") {
      return transactions.find((b) => b.id === object.id);
    }
    return undefined;
  }, [transactions, object]);

  /**
   * Check if the dialog is open
   */
  const isOpen = useMemo(() => {
    return isStateOpen && !!openedTransaction;
  }, [isStateOpen, openedTransaction]);

  /**
   * Open a transaction for editing
   */
  const handleOpen = useCallback(
    (b: Transaction | string, ops?: Omit<OpenQueryStateOptions, "state">) => {
      const id = typeof b === "string" ? b : b.id;
      handleStateOpen({
        ...ops,
        state: { object: { action: "edit", type: "transaction", id } },
      });
    },
    [handleStateOpen]
  );

  /**
   * Close the editor
   */
  const handleClose = useCallback(() => {
    handleStateClose();
  }, [handleStateClose]);

  /**
   * Return all information in a memorized reference
   */
  return useMemo(
    () => ({
      openedTransaction,
      openedId: openedTransaction?.id,
      isOpen,
      handleOpen,
      handleClose,
    }),
    [isOpen, openedTransaction, handleOpen, handleClose]
  );
}
