/**
 * Utility type to extract the resolved value T
 * from a promise of type Promise<T>
 */
type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

/**
 * Utility type that creates a type that is either of type T or
 * Promise<T>
 */
type MaybePromise<T> = T | Promise<T>;
