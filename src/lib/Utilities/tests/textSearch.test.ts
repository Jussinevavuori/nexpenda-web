import { textSearch } from "../textSearch";

describe("textSearch", () => {
  it("Matches single keyword case-insensitively", () => {
    expect(textSearch("What", "What")).toBe(true);
    expect(textSearch("What", "it is what")).toBe(true);
    expect(textSearch("What", " w h a t ")).toBe(false);
  });
  it("Matches multiple keywords case-insensitively", () => {
    expect(textSearch("What", "_what_", "1")).toBe(true);
    expect(textSearch("What", "1", "_what_")).toBe(true);
  });
});
