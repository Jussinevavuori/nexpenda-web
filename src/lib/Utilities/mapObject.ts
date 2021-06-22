export function mapObject<T extends {}, V>(
  o: T,
  fn: (k: keyof T, v: T[typeof k]) => V
): { [K in keyof T]: V } {
  let result: Partial<{ [K in keyof T]: V }> = {};

  for (const k in o) {
    const v = o[k];
    result[k] = fn(k, v);
  }

  return result as { [K in keyof T]: V };
}
