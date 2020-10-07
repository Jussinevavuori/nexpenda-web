export type Result<T, R = string> = Success<T, R> | Failure<T, R>;

export interface IResult<T, R = string> {
  readonly resultType: "success" | "failure";
  getOr(fallback: T): T;
  isSuccess(): this is Success<T, R>;
  isFailure(): this is Failure<T, R>;
}

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
