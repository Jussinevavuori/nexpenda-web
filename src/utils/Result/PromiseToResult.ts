import { Failure, Success } from "./Result";

export function PromiseToResult<T, E = any>(promise: Promise<T>) {
  return promise
    .then((resolved) => new Success<T, E>(resolved))
    .catch((rejected) => new Failure<T, E>(rejected));
}
