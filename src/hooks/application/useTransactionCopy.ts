import { useCallback } from "react";
import { useTransactionCreatorOpenState } from "../componentStates/useTransactionCreatorOpenState";
import { Transaction } from "../../classes/Transaction";
import { TransactionCopySubscriber } from "./useOnTransactionCopy";
import { useTransactionEditorOpenState } from "../componentStates/useTransactionEditorOpenState";

export function useTransactionCopy() {
  const { handleOpen: handleTransactionCreatorOpen } =
    useTransactionCreatorOpenState();
  const { openedId: editingTransactionId } = useTransactionEditorOpenState();

  return useCallback(
    (transaction: Transaction) => {
      // When not editing a transaction, open the transaction creator
      if (!editingTransactionId) {
        handleTransactionCreatorOpen();
      }

      // Publish the copy event (on a timeout in order to allow the
      // form to render before it receives the data)
      setTimeout(() => {
        TransactionCopySubscriber.publish(transaction);
      }, 10);
    },
    [editingTransactionId, handleTransactionCreatorOpen]
  );
}
