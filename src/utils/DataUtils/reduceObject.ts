type FN<T extends {}, R> = (r: R, v: T[keyof T], k: keyof T) => R;

export function reduceObject<R, T extends {}>(
  object: T,
  reducer: FN<T, R>,
  initial: R
): R {
  let result: R = initial;

  for (const k in object) {
    const v = object[k];
    result = reducer(result, v, k);
  }

  return result;
}
