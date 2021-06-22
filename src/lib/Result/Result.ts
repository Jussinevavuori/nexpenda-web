import { Failure } from "./Failure";
import { Success } from "./Success";

/**
 * A result can either be a success with a value of type T or a failure with a
 * reason of type R.
 */
export type Result<T, R = string> = Success<T, R> | Failure<T, R>;

/**
 * All results (successes and failures) must implement the result interface
 * which includes their type and methods for checking their type and safely
 * fetching the succeeded value.
 */
export interface IResult<T, R = string> {
  /**
   * Result type as string.
   */
  readonly resultType: "success" | "failure";

  /**
   * Allows fetching the value if the result is a success or the fallback value
   * if the result failed.
   *
   * @param fallback Fallback value to return if the result is a failure.
   */
  getOr<FB>(fallback: FB): T | FB;

  /**
   * Method to ensure a result is a success. Allows for improved typing after
   * check.
   */
  isSuccess(): this is Success<T, R>;

  /**
   * Method to ensure a result is a failure. Allows for improved typing after
   * check.
   */
  isFailure(): this is Failure<T, R>;
}
