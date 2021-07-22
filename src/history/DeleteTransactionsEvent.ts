import { Transaction } from "../lib/DataModels/Transaction";
import { InvalidServerResponseFailure } from "../lib/Result/Failures";
import { NetworkFailure } from "../lib/Result/Failures";
import { Success } from "../lib/Result/Success";
import { store } from "../store";
import { HistoryEvent } from "./HistoryEvent";

/**
 * Defines a strategy for a mass deletion event
 */
export class DeleteTransactionsEvent extends HistoryEvent<
  Array<
    | Success<JsonTransaction, string>
    | NetworkFailure<any, { errors?: any }>
    | InvalidServerResponseFailure<JsonTransaction>
  >
> {
  readonly transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    super("transaction/delete", () => {
      const put = store.getActions().transactions.putTransaction;
      return Promise.all(
        this.transactions.map((transaction) => {
          return put({
            id: transaction.id,
            integerAmount: transaction.amount.value,
            time: transaction.date.getTime(),
            comment: transaction.comment,
            scheduleId: transaction.scheduleId,
            category: transaction.category.value,
          });
        })
      );
    });
    this.transactions = transactions;
  }
}
