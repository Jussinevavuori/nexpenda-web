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
      return store.getActions().transactions.putTransaction({
        id: this.transaction.id,
        integerAmount: this.transaction.amount.value,
        time: this.transaction.date.getTime(),
        comment: this.transaction.comment,
        scheduleId: this.transaction.scheduleId,
        category: this.transaction.category.value,
      });
    });
    this.transaction = transaction;
  }
}
