import { reduceObject } from "../reduceObject";

describe("reduceObject", () => {
  it("Returns initial for empty object", () => {
    expect(reduceObject({}, () => 1, 0)).toBe(0);
  });
  it("Calls correct values and accumulates them", () => {
    const arr = reduceObject(
      { a: 1, b: 2, c: 3 },
      (arr, value) => [...arr, value],
      [] as number[]
    );
    expect(arr).toHaveLength(3);
    expect(arr).toContain(1);
    expect(arr).toContain(2);
    expect(arr).toContain(3);
  });
  it("Calls correct keys and accumulates them", () => {
    const arr = reduceObject(
      { a: 1, b: 2, c: 3 },
      (arr, value, key) => [...arr, key],
      [] as string[]
    );
    expect(arr).toHaveLength(3);
    expect(arr).toContain("a");
    expect(arr).toContain("b");
    expect(arr).toContain("c");
  });
  it("Calls correct key-value pairs and accumulates them", () => {
    const arr = reduceObject(
      { a: 1, b: 2, c: 3 },
      (arr, value, key) => [...arr, `${key}:${value}`],
      [] as string[]
    );
    expect(arr).toHaveLength(3);
    expect(arr).toContain("a:1");
    expect(arr).toContain("b:2");
    expect(arr).toContain("c:3");
  });
});
