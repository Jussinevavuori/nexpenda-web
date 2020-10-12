import { Failure } from "./Failure";
import { IResult } from "./Result";

export class Success<T, R = string> implements IResult<T, R> {
  public readonly resultType: "success" = "success";
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public getOr(fallback: T): T {
    return this.value;
  }

  public isSuccess(): this is Success<T, R> {
    return true;
  }

  public isFailure(): this is Failure<T, R> {
    return false;
  }

  static All<T>(results: IResult<T>[]) {
    const all: Success<T>[] = [];
    results.forEach((result) => {
      if (result.isSuccess()) {
        all.push(result);
      }
    });
    return all;
  }

  static Empty() {
    return new Success<void>(undefined);
  }
}
