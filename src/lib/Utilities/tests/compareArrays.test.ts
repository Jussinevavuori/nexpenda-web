import { compareArrays } from "../compareArrays";

describe("compareArrays", () => {
  it("Always matches empty arrays", () => {
    expect(compareArrays([], [])).toBe(true);
    expect(compareArrays([], [], () => false)).toBe(true);
  });

  it("Matches primitive arrays", () => {
    expect(compareArrays([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(compareArrays([1, 2, 3], [1, 2, 3], (a, b) => a === b)).toBe(true);
    expect(compareArrays([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it("Does not compare order", () => {
    expect(compareArrays([1, 2, 3], [3, 2, 1])).toBe(true);
  });

  it("Can compare based on ID property", () => {
    expect(
      compareArrays(
        [{ id: "a" }, { id: "b" }, { id: "c" }],
        [{ id: "b" }, { id: "c" }, { id: "a" }],
        (a, b) => a.id === b.id
      )
    ).toBe(true);
    expect(
      compareArrays(
        [{ id: "a" }, { id: "b" }, { id: "c" }],
        [{ id: "a" }, { id: "b" }, { id: "d" }],
        (a, b) => a.id === b.id
      )
    ).toBe(false);
  });
});
