import { mapObject } from "./mapObject";

describe("mapObject", () => {
  it("Maps an empty object", () => {
    const mapped = mapObject({}, (key) => key);
    expect(mapped).toMatchObject({});
  });
  it("Maps a numeric object", () => {
    const mapped = mapObject(
      { a: 1, b: 2, c: 3 },
      (key, value) => value * value
    );
    expect(mapped).toMatchObject({ a: 1, b: 4, c: 9 });
  });
  it("Maps using correct keys", () => {
    const mapped = mapObject({ a: 1, b: 2, c: 3 }, (key, value) => key);
    expect(mapped).toMatchObject({ a: "a", b: "b", c: "c" });
  });
  it("Maps to different type", () => {
    const mapped = mapObject(
      { a: 1, b: 2, c: 3 },
      (key, value) => value % 2 === 0
    );
    expect(mapped).toMatchObject({ a: false, b: true, c: false });
  });
  it("Maps correct key and value pairs", () => {
    const mapped = mapObject(
      { a: 1, b: 2, c: 3 },
      (key, value) => `${key}${value}`
    );
    expect(mapped).toMatchObject({ a: "a1", b: "b2", c: "c3" });
  });
});
