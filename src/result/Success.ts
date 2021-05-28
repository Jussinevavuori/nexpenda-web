import { Failure } from "./Failure";
import { IResult } from "./Result";

export class Success<T, R = string> implements IResult<T, R> {
  public readonly resultType: "success" = "success";
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public getOr<FB>(fallback: FB): T | FB {
    return this.value;
  }

  public isSuccess(): this is Success<T, R> {
    return true;
  }

  public isFailure(): this is Failure<T, R> {
    return false;
  }

  /**
   * Get all successes from a list of results.
   */
  static All<T>(results: IResult<T>[]) {
    return results.reduce((successes, result) => {
      return result.isSuccess() ? [...successes, result] : successes;
    }, [] as Array<Success<T, string>>);
  }

  /**
   * Create a new empty success without a value with the void type.
   */
  static Empty() {
    return new Success<void>(undefined);
  }
}
