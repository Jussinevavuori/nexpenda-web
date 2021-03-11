import { Failure } from "./Failure";

export class StripeInitializationFailure<T> extends Failure<
  T,
  "stripe-initialization-failure"
> {
  constructor() {
    super("stripe-initialization-failure");
  }
}
