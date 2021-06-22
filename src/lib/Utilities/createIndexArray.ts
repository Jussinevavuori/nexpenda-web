/**
 * Creates an index array of `n` items.
 *
 * @param n Amount of items in the created index array
 *
 * @example
 * createIndexArray(3) // returns [0,1,2]
 */
export function createIndexArray(n: number) {
  let arr: number[] = [];
  for (let i = 0; i < Math.floor(n); i++) {
    arr.push(i);
  }
  return arr;
}
