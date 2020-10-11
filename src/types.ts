/**
 * Utility type to extract the resolved value T
 * from a promise of type Promise<T>
 */
export type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;
