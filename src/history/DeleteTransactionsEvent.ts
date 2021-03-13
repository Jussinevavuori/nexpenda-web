import { Transaction } from "../classes/Transaction";
import { InvalidServerResponseFailure } from "../result/InvalidServerResponseFailures";
import { NetworkFailure } from "../result/NetworkFailures";
import { Success } from "../result/Success";
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
    super("transaction/delete", async () => {
      const jsons = transactions.map((_) => _.toJsonInitializer({ id: true }));
      const put = store.getActions().transactions.putTransaction;
      const results = await Promise.all(jsons.map((json) => put(json)));
      return results;
    });
    this.transactions = transactions;
  }
}
