import { removeProperty } from "../removeProperty";

describe("removeProperty", () => {
  it("Does not alter an empty object", () => {
    expect(removeProperty({} as any, "" as any)).toMatchObject({});
  });
  it("Removes a key", () => {
    expect(removeProperty({ a: 1, b: 2, c: 3 }, "a")).toMatchObject({
      b: 2,
      c: 3,
    });
  });
  it("Returns a new object", () => {
    const original = { a: 1, b: 2, c: 3 };
    expect(original).toEqual(original);
    expect(removeProperty(original, "a")).not.toEqual(original);
  });
});
