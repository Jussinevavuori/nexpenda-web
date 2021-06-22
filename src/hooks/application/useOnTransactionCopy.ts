import { useEffect } from "react";
import { Transaction } from "../../lib/DataModels/Transaction";
import { PubSubChannel } from "../../lib/PubSub/PubSubChannel";

export const TransactionCopySubscriber = new PubSubChannel(
  (copiedTransaction: Transaction) => copiedTransaction
);

export function useOnTransactionCopy(
  callback: (copiedTransaction: Transaction) => any
) {
  return useEffect(() => {
    return TransactionCopySubscriber.subscribe(callback);
  }, [callback]);
}
