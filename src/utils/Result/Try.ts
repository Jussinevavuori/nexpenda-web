import { Success, Failure, Result } from "./Result";

// Synchronous Try overload
export function Try<T = undefined, E = undefined>(
  fn: () => Success<T, any> | Failure<any, E>
): Result<T, E>;

// Asynchronous Try overload
export function Try<T = undefined, E = undefined>(
  fn: () => Promise<Success<T, any> | Failure<any, E>>
): Promise<Result<T, E>>;

/**
 * Running code inside a try function enables returning a `Success`
 * or a `Failure` instance, either synchronously or asynchronously
 * and the function will handle
 */
export function Try<T = undefined, E = undefined>(
  fn:
    | (() => Success<T, any> | Failure<any, E>)
    | (() => Promise<Success<T, any> | Failure<any, E>>)
): Result<T, E> | Promise<Result<T, E>> {
  const result = fn();

  if (result instanceof Promise) {
    return result.then((_result) => {
      if (_result instanceof Success) {
        return new Success<T, E>(_result.value);
      } else {
        return new Failure<T, E>(_result.value, _result.details);
      }
    });
  } else {
    if (result instanceof Success) {
      return new Success<T, E>(result.value);
    } else {
      return new Failure<T, E>(result.value, result.details);
    }
  }
}
