import { IProblem, Problem } from "./Problem";

export type Result<T = any, E = any> = Success<T, E> | Failure<T, E>;

export function promiseToResult<T = any>(
  promise: Promise<T>
): Promise<Result<T>> {
  return promise
    .then((value) => new Success(value))
    .catch((value) => new Failure(value));
}

interface IResult<T = any, E = any> {
  /**
   * The current value, either the success or failure value
   */
  value: T | E;

  /**
   * Currently stored value, whether it is the success value or failure value
   */
  getOr(fallbackValue: T): T;

  /**
   * Check if this ``Result`` is a success
   */
  isSuccess(): this is Success<T, E>;

  /**
   * Check if this ``Result`` is a failure
   */
  isFailure(): this is Failure<T, E>;

  /**
   * If and when the ``Result`` succeeds, this function will map the ``Success``
   * to another ``Result`` (potentially failing the value) or use the existing
   * ``Failure`` if the original ``Result`` failed.
   */
  map<U = T, R = E>(fn: (value: T) => Result<U, E | R>): Result<U, E | R>;

  /**
   * If the ``Result`` succeeds, the provided callback function is ran with the
   * success value. This is an alternative to saying
   *
   * ```
   * if (result.isSuccess()) {
   *   callback(result.value)
   * }
   * ```
   */
  onSuccess(callback: (value: T) => void): void;

  /**
   * If the ``Result`` fails, the provided callback function is ran with the
   * failure value. This is an alternative to saying
   *
   * ```
   * if (result.isFailure()) {
   *   callback(result.value)
   * }
   * ```
   */
  onFailure(callback: (value: E) => void): void;

  /**
   * If and when the ``Result`` succeeds, maps the success value to a new value
   * using the given function.
   */
  mapSuccess<U = T>(fn: (value: T) => U): Result<U, E>;

  /**
   * If and when the ``Result`` fails, maps the failure value to a new value
   * using the given function.
   */
  mapFailure<U = E>(fn: (value: E) => U): Result<T, U>;

  /**
   * If and when the ``Result`` succeeds, this function will map the ``Success``
   * to either the given ``Success`` or the given ``Failure`` based on whether
   * the given function returns true with the current success value. If the
   * original ``Result`` failed, returns with the original ``Failure``.
   */
  transform<U = T, R = E>(
    fn: (value: T) => boolean,
    success: (value: T) => Success<U, any>,
    failure: (value: T) => Failure<any, R>
  ): Result<U, E | R>;

  /**
   * In and when the ``Result`` succeeds, this function will ensure the type of
   * the success value and return a ``Success`` if the type of the value is
   * correct, else it will return a new ``Failure`` as specified. If the
   * original ``Result`` failed, returns with the original ``Failure``.
   */
  ensureType<U = T, R = E, D = any>(
    value: (value: T) => D,
    typeGuard: (value: any) => value is U,
    failure: (value: D) => Result<U, R>
  ): Result<U, E | R>;
}

/**
 * Success implementation
 */
export class Success<T = any, E = any> implements IResult<T, E> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getOr(fallbackValue: T): T {
    return this.value;
  }

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }

  onSuccess(callback: (value: T) => void): void {
    callback(this.value);
  }

  onFailure(callback: (value: E) => void): void {}

  map<U = T, E2 = E>(fn: (value: T) => Result<U, E | E2>): Result<U, E | E2> {
    return fn(this.value);
  }

  mapSuccess<U = T>(fn: (value: T) => U): Result<U, E> {
    return new Success(fn(this.value));
  }

  mapFailure<U = E>(fn: (value: E) => U): Result<T, U> {
    return new Success(this.value);
  }

  transform<U = T, R = E>(
    fn: (value: T) => boolean,
    success: (value: T) => Success<U, any>,
    failure: (value: T) => Failure<any, R>
  ): Result<U, E | R> {
    return fn(this.value)
      ? new Success<U, E | R>(success(this.value).value)
      : new Failure<U, E | R>(failure(this.value).value);
  }

  ensureType<U = T, R = E, D = any>(
    value: (value: T) => D,
    typeGuard: (value: any) => value is U,
    failure: (value: D) => Result<U, R>
  ): Result<U, E | R> {
    const v = value(this.value);
    if (typeGuard(v)) {
      return new Success<U, E | R>(v);
    } else {
      return failure(v);
    }
  }

  static From<R = any, U = any>(value: U) {
    return new Success<U, R>(value);
  }

  static Empty<R = any>() {
    return new Success<undefined, R>(undefined);
  }
}

/**
 * Failure implementation
 */
export class Failure<T = any, E = any> implements IResult<T, E> {
  value: E;

  constructor(value: E) {
    this.value = value;
  }

  getOr(fallbackValue: T): T {
    return fallbackValue;
  }

  onSuccess(callback: (value: T) => void): void {}

  onFailure(callback: (value: E) => void): void {
    callback(this.value);
  }

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return true;
  }

  map<U = T, E2 = E>(fn: (value: T) => Result<U, E | E2>): Result<U, E | E2> {
    return new Failure<U, E>(this.value);
  }

  mapSuccess<U = T>(fn: (value: T) => U): Result<U, E> {
    return new Failure(this.value);
  }

  mapFailure<U = E>(fn: (value: E) => U): Result<T, U> {
    return new Failure(fn(this.value));
  }

  transform<U = T, R = E>(
    fn: (value: T) => boolean,
    success: (value: T) => Success<U, any>,
    failure: (value: T) => Failure<any, R>
  ): Result<U, E | R> {
    return new Failure<U, E | R>(this.value);
  }

  ensureType<U = T, R = E, D = any>(
    value: (value: T) => D,
    typeGuard: (value: any) => value is U,
    failure: (value: D) => Result<U, R>
  ): Result<U, E | R> {
    return new Failure<U, E | R>(this.value);
  }

  static Problem<U = any, R extends object = {}>(problem: IProblem<R>) {
    return new Failure<U, Problem<R>>(new Problem(problem));
  }
}
