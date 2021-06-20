import { forEach } from "./forEach";

describe("forEach", () => {
  it("Runs never on empty object", () => {
    let runs = 0;
    forEach({}, () => {
      runs++;
    });
    expect(runs).toBe(0);
  });

  it("Runs once for each object key", () => {
    let runs = 0;
    forEach({ a: 1, b: 2, c: 3 }, () => {
      runs++;
    });
    expect(runs).toBe(3);
  });

  it("Calls correct values", () => {
    let values: any[] = [];
    forEach({ a: 1, b: 2, c: 3 }, (value) => values.push(value));
    expect(values).toHaveLength(3);
    expect(values).toContain(1);
    expect(values).toContain(2);
    expect(values).toContain(3);
  });

  it("Calls correct values", () => {
    let keys: any[] = [];
    forEach({ a: 1, b: 2, c: 3 }, (value, key) => keys.push(key));
    expect(keys).toHaveLength(3);
    expect(keys).toContain("a");
    expect(keys).toContain("b");
    expect(keys).toContain("c");
  });

  it("Calls correct key-value pairs", () => {
    let pairs: any[] = [];
    forEach({ a: 1, b: 2, c: 3 }, (value, key) =>
      pairs.push(`${key}:${value}`)
    );
    expect(pairs).toHaveLength(3);
    expect(pairs).toContain("a:1");
    expect(pairs).toContain("b:2");
    expect(pairs).toContain("c:3");
  });
});
