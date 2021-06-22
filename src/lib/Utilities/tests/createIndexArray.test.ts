import { createIndexArray } from "../createIndexArray";

describe("createIndexArray", () => {
  it("Creates empty array", () => {
    expect(createIndexArray(0)).toHaveLength(0);
  });

  it("Creates valid array", () => {
    const arr = createIndexArray(6);
    expect(arr).toHaveLength(6);
    expect(arr[0]).toBe(0);
    expect(arr[1]).toBe(1);
    expect(arr[2]).toBe(2);
    expect(arr[3]).toBe(3);
    expect(arr[4]).toBe(4);
    expect(arr[5]).toBe(5);
  });

  it("Creates big arrays", () => {
    const arr = createIndexArray(6_000);
    expect(arr).toHaveLength(6_000);
    for (let i = 0; i < 6_000; i++) {
      expect(arr[i]).toBe(i);
    }
  });

  it("Floors values", () => {
    const arr = createIndexArray(5.55);
    expect(arr).toHaveLength(5);
  });

  it("Creates empty array for negative values", () => {
    const arr = createIndexArray(-10);
    expect(arr).toHaveLength(0);
  });
});
