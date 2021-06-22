import { clamp } from "../clamp";

describe("clamp", () => {
  it("Leaves values in range as is", () => {
    expect(clamp(1, 0, 2)).toBe(1);
  });
  it("Clamps to minimum range at min and below", () => {
    expect(clamp(0, 0, 2)).toBe(0);
    expect(clamp(-1, 0, 2)).toBe(0);
  });
  it("Clamps to maximum range at max and below", () => {
    expect(clamp(2, 0, 2)).toBe(2);
    expect(clamp(3, 0, 2)).toBe(2);
  });
  it("Clamps to value on unitary range", () => {
    expect(clamp(1, 4, 4)).toBe(4);
  });
  it("Allows range to be passed in wrong order", () => {
    expect(clamp(3, 4, 2)).toBe(3);
    expect(clamp(5, 4, 2)).toBe(4);
    expect(clamp(1, 4, 2)).toBe(2);
  });
});
