import { Failure } from "./Failure";

export class UnimplementedFailure<T> extends Failure<T, "unimplemented"> {
  constructor() {
    super("unimplemented");
  }
}

export class UnknownFailure<T> extends Failure<T, "unknown"> {
  constructor() {
    super("unknown");
  }
}

export class ErrorFailure<T> extends Failure<T, "error"> {
  public readonly error: Error;
  constructor(error: Error, options: { silent?: boolean } = {}) {
    super("error", options);
    this.error = error;
  }
}
