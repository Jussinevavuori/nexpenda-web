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
type ThemeColor = "blue" | "green" | "red" | "yellow" | "purple" | "pink";

/**
 * All possible color modes
 */
type ThemeMode = "dark" | "light";

type ThemePropertyLabel =
  | "color-100"
  | "color-200"
  | "color-300"
  | "color-400"
  | "color-500"
  | "color-600"
  | "color-700"
  | "color-800"
  | "color-900";

type ThemeProperty = {
  type: "color";
  label: ThemePropertyLabel;
  sourceName: string;
  targetName: string;
};

type NonEmptyArray<T> = [T, ...T[]];
