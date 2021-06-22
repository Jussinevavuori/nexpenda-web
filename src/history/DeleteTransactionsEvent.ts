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
    super("transaction/delete", async () => {
      const jsons = transactions.map((_) => _.toJsonInitializer({ id: true }));
      const put = store.getActions().transactions.putTransaction;
      const results = await Promise.all(jsons.map((json) => put(json)));
      return results;
    });
    this.transactions = transactions;
  }
}
