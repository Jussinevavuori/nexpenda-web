import { IResult } from "./Result";
import { Success } from "./Success";

export class Failure<T, R = string> implements IResult<T, R> {
  public readonly resultType: "failure" = "failure";
  public readonly reason: R;

  constructor(reason: R) {
    this.reason = reason;
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
