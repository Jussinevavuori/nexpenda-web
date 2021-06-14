import { useEffect } from "react";
import { Transaction } from "../../classes/Transaction";
import { Subscribable } from "../../utils/SubscriptionUtils/Subscribable";

export const TransactionCopySubscriber = new Subscribable(
  (copiedTransaction: Transaction) => copiedTransaction
);

export function useOnTransactionCopy(
  callback: (copiedTransaction: Transaction) => any
) {
  return useEffect(() => {
    return TransactionCopySubscriber.subscribe(callback);
  }, [callback]);
}
