type Comparison<T> = (a: T, b: T) => boolean;

/**
 * Compares the two arrays and whether they contain the same elements
 * (order does not matter, element similarity is determined by the
 * comparison function.)
 *
 * Example:
 *
 * ```
 * compareArrays([1,2], [2,1]) === true
 *
 * compareArrays([1,2,3],[1,2]) === false
 *
 * compareArrays([1,3], [1,2]) === false
 *
 * compareArrays(
 *   ["ab", "ac"], ["bb", "bc"],
 *   (a, b) => a.charAt(1) === b.charAt(1)
 * ) === true
 *
 * compareArrays(
 *   ["ab", "ac"], ["bb", "bc"],
 *   (a, b) => a.charAt(0) === b.charAt(0)
 * ) === false
 * ```
 *
 * @param a
 * @param b
 */
export function compareArrays<T>(
  a: Array<T>,
  b: Array<T>,
  compare: Comparison<T> = (a, b) => a === b
) {
  if (a.length === 0 && b.length === 0) return true;
  if (a.length !== b.length) return false;

  return a.every((item) => {
    const na = a.filter((_) => compare(_, item)).length;
    const nb = b.filter((_) => compare(_, item)).length;
    return na === nb;
  });
}
