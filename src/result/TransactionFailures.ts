import { Failure } from "./Failure";

export class TransactionNotFoundFailure<T> extends Failure<
  T,
  "transaction-not-found"
> {
  readonly transactionId?: string;

  constructor(transactionId?: string) {
    super("transaction-not-found");
    this.transactionId = transactionId;
  }
}
