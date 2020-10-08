import { Failure } from "../Result/Result";

export class FailureHandlerMissingStrategyFailure<T> extends Failure<
  T,
  "failure-handler-missing-strategy"
> {
  constructor() {
    super("failure-handler-missing-strategy");
  }
}

export class FailureHandlerStrategyFailure<T> extends Failure<
  T,
  "failure-handler-strategy"
> {
  constructor() {
    super("failure-handler-strategy");
  }
}
