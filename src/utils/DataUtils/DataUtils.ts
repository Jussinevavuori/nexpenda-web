type ObjectIndexable = string | number | symbol;

type ComparisonFunction<T> = (a: T, b: T) => boolean;

export class DataUtils {
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
  static unique<T>(
    array: Array<T>,
    compare: ComparisonFunction<T> = (a, b) => a === b
  ) {
    return array.filter(
      (a, i, arr) => i === arr.findIndex((b) => compare(a, b))
    );
  }

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
  static compareArrays<T>(
    a: Array<T>,
    b: Array<T>,
    compare: ComparisonFunction<T> = (a, b) => a === b
  ) {
    if (a.length === 0 && b.length === 0) return true;
    if (a.length !== b.length) return false;

    return a.every((item) => {
      const na = a.filter((_) => compare(_, item)).length;
      const nb = b.filter((_) => compare(_, item)).length;
      return na === nb;
    });
  }

  /**
   * Takes in two objects with arrays under the keys and merges the arrays
   * per key.
   *
   * Example:
   *
   * ```
   * mergeArrayObjects(
   *   { a: [1, 2], b: [1] },
   *   { a: [3, 4], c: [2] }
   * ) === { a: [1, 2, 3, 4], b: [1], c: [2] }
   * ```
   */
  static mergeArrayObjects<A, B>(
    a: Partial<Record<ObjectIndexable, Array<A>>>,
    b: Partial<Record<ObjectIndexable, Array<B>>>
  ) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    const keys = DataUtils.unique([...aKeys, ...bKeys]);

    return keys.reduce((object, key) => {
      return { ...object, [key]: [...(a[key] ?? []), ...(b[key] ?? [])] };
    }, {} as Record<ObjectIndexable, Array<A | B>>);
  }

  /**
   * Searches text
   */
  static textSearch(search: string, ...match: string[]) {
    const searchTerm = search.toLowerCase();
    return match.some((matchable) => {
      return matchable.toLowerCase().includes(searchTerm);
    });
  }

  /**
   * Chunkifies an array to a two-dimensional array
   */
  static chunkify<T>(array: T[], chunkSize: number): Array<T[]> {
    const chunks: Array<T[]> = [];

    array.forEach((item) => {
      const lastChunk = chunks[chunks.length - 1];

      if (!lastChunk || lastChunk.length === chunkSize) {
        chunks.push([item]);
      } else {
        lastChunk.push(item);
      }
    });

    return chunks;
  }

  /**
   * Creates an index array of `n` items.
   *
   * @param n Amount of items in the created index array
   *
   * @example
   * createIndexArray(3) // returns [0,1,2]
   */
  static createIndexArray(n: number) {
    let arr: number[] = [];
    for (let i = 0; i < n; i++) {
      arr.push(i);
    }
    return arr;
  }

  /**
   * Map a value from one range to another.
   *
   * @param value		Value to map
   * @param oldMin	Minimum of value's original range
   * @param oldMax	Maximum of value's original range
   * @param newMin	Minimum of target range
   * @param newMax	Maximum of target range
   * @param options	Should the value be clamped
   *
   * @returns Mapped value
   */
  static mapValue(
    value: number,
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number,
    options: { clamp?: boolean } = {}
  ) {
    let v = value;

    const oldRng = oldMax - oldMin; // Old range
    const newRng = newMax - newMin; // New range

    v -= oldMin; // Translate to start from 0
    v /= oldRng; // Normalize to range between 0 and 1
    v *= newRng; // Scale to new range
    v += newMin; // Translate to new position

    if (options.clamp) v = DataUtils.clamp(v, newMin, newMax); // Clamp

    return v;
  }

  /**
   *  Utility clamp function.
   *
   * @param value	Value to clamp
   * @param min 	Min value
   * @param max 	Max value
   * @returns 		Clamped value
   */
  static clamp(value: number, min: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}
