type Comparison<T> = (a: T, b: T) => boolean;

/**
 * Returns a copy of the array with only unique values w.r.t. the
 * comparison function.
 *
 * Example:
 *
 * ```
 * unique([1,2,2,3]) === [1,2,3]
 * ```
 *
 * ```
 * unique(["a", "b", "aa", "bbb"], (a, b) => a.length === b.length)
 * === ["a", "aa", "bbb"]
 * ```
 *
 * @param array		Input array
 * @param compare Comparison function to determine uniqueness.
 * 								If given two values the function returns `true`,
 * 								the two values are considered equal and thus one is
 * 								removed. By default uses the `===` comparison to
 * 								determine equality.
 */
export function unique<T>(
  arr: Array<T>,
  cmp: Comparison<T> = (a, b) => a === b
) {
  return arr.filter((a, i, arr) => i === arr.findIndex((b) => cmp(a, b)));
}
