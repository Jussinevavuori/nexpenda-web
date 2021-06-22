import { unique } from "../unique";

describe("unique", () => {
  it("Works on empty arrays", () => {
    expect(unique([])).toMatchObject([]);
  });
  it("Works on primitive arrays", () => {
    expect(unique([1, 2, 3, 4])).toMatchObject([1, 2, 3, 4]);
    expect(unique([1, 1, 2, 2, 3, 3, 4, 4])).toMatchObject([1, 2, 3, 4]);
  });
  it("Works on objects", () => {
    const arr = [{ id: 1 }, { id: 1 }, { id: 1 }];
    expect(unique(arr)).toMatchObject(arr);
    expect(unique(arr)).toHaveLength(3);

    expect(unique(arr, (a, b) => a.id === b.id)).toMatchObject([{ id: 1 }]);
    expect(unique(arr, (a, b) => a.id === b.id)).toHaveLength(1);
  });
});
