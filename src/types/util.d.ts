/**
 * Utility type to extract the resolved value T
 * from a promise of type Promise<T>
 */
type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Utility type to extract the resolved value T
 * from a promise of type Promise<T>
 */
type Unwrap<T> = T extends PromiseLike<infer U>
  ? U
  : T extends Array<infer U>
  ? U
  : T;

/**
 * Utility type that creates a type that is either of type T or
 * Promise<T>
 */
type MaybePromise<T> = T | Promise<T>;

/**
 * Array which contains at least one element of type T
 */
type NonEmptyArray<T> = [T, ...T[]];
