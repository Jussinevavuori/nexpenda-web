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

/**
 * Type for properties which transactions can be sorted by
 */
type TransactionSortableProperty = "amount" | "date" | "category" | "comment";

/**
 * Type for strategies for sorting transactions
 */
type TransactionSortStrategy =
  | "none"
  | "amount-ascending"
  | "amount-descending"
  | "date-ascending"
  | "date-descending"
  | "category-ascending"
  | "category-descending"
  | "comment-ascending"
  | "comment-descending";

/**
 * All possible themes
 */
type Theme = "blue" | "green";
