import { JsonTransaction, Transaction } from "../classes/Transaction";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { NetworkFailure } from "../result/NetworkFailures";
import { Success } from "../result/Success";
import { store } from "../store";
import { HistoryEvent } from "./HistoryEvent";

/**
 * Defines a strategy for a single deletion event
 */
export class DeleteTransactionEvent extends HistoryEvent<
  | Success<JsonTransaction, string>
  | NetworkFailure<any, { errors?: any }>
  | InvalidServerResponseFailure<JsonTransaction>
> {
  readonly transaction: Transaction;

  constructor(transaction: Transaction) {
    super("transaction/delete", () => {
      const json = transaction.toJsonInitializer();
      const put = store.getActions().transactions.putTransaction;
      return put(json);
    });
    this.transaction = transaction;
  }
}
