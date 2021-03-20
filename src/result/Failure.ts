import { IResult } from "./Result";
import { Success } from "./Success";

export class Failure<T, R = string> implements IResult<T, R> {
  public readonly resultType: "failure" = "failure";
  public readonly reason: R;

  constructor(reason: R, options: { silent?: boolean } = {}) {
    this.reason = reason;

    if (!options.silent) {
      if (process.env.NODE_ENV === "development") {
        console.error(this);
      } else {
        console.error(this.reason);
      }
    }
  }

  public getOr(fallback: T): T {
    return fallback;
  }

  public isSuccess(): this is Success<T, R> {
    return false;
  }

  public isFailure(): this is Failure<T, R> {
    return true;
  }

  static All<T>(results: IResult<T>[]) {
    const all: Failure<T, string>[] = [];
    results.forEach((result) => {
      if (result.isFailure()) {
        all.push(result);
      }
    });
    return all;
  }
}
