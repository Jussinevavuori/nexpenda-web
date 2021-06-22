import { Transaction } from "../lib/DataModels/Transaction";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { NetworkFailure } from "../lib/Result/Failures";
import { Success } from "../lib/Result/Success";
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
      const json = transaction.toJsonInitializer({ id: true });
      const put = store.getActions().transactions.putTransaction;
      return put(json);
    });
    this.transaction = transaction;
  }
}
