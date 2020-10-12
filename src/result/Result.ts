import { Failure } from "./Failure";
import { Success } from "./Success";

export type Result<T, R = string> = Success<T, R> | Failure<T, R>;

export interface IResult<T, R = string> {
  readonly resultType: "success" | "failure";
  getOr(fallback: T): T;
  isSuccess(): this is Success<T, R>;
  isFailure(): this is Failure<T, R>;
}
