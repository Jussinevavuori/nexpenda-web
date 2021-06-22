type MapperFunction<T extends {}, R> = (v: T[keyof T], k: keyof T) => R;

export function forEach<T extends {}, R>(o: T, fn: MapperFunction<T, R>): void {
  for (const k in o) {
    const v = o[k];
    fn(v, k);
  }
}
