import { useCallback } from "react";
import { useOpenStateWrapper } from "../state/useOpenStateWrapper";
import { useTransactionCreatorDrawerOpenState } from "../componentStates/useTransactionCreatorDrawerOpenState";
import { Transaction } from "../../classes/Transaction";
import { TransactionCopySubscriber } from "./useOnTransactionCopy";
import { useTransactionEditorDrawerVariableOpenState } from "../componentStates/useTransactionEditorDrawerVariableOpenState";

export function useTransactionCopy() {
  const { handleOpen: handleTransactionCreatorOpen } = useOpenStateWrapper(
    useTransactionCreatorDrawerOpenState()
  );
  const [editingTransactionId] = useTransactionEditorDrawerVariableOpenState();

  return useCallback(
    (transaction: Transaction) => {
      // When not editing a transaction, open the transaction creator
      if (!editingTransactionId) {
        handleTransactionCreatorOpen();
      }

      // Publish the copy event
      TransactionCopySubscriber.publish(transaction);
    },
    [editingTransactionId, handleTransactionCreatorOpen]
  );
}
