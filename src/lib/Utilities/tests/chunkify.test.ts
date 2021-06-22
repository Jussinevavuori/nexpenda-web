import { chunkify } from "../chunkify";

describe("chunkify", () => {
  it("Works on empty arrays", () => {
    const res = chunkify([], 1);
    expect(res).toHaveLength(0);
  });
  it("Chunks an array properly", () => {
    const res = chunkify([11, 12, 13, 21, 22, 23, 31, 32, 33], 3);
    expect(res).toHaveLength(3);
    expect(res[0]).toHaveLength(3);
    expect(res[1]).toHaveLength(3);
    expect(res[2]).toHaveLength(3);

    expect(res[0]).toContain(11);
    expect(res[0]).toContain(12);
    expect(res[0]).toContain(13);
    expect(res[1]).toContain(21);
    expect(res[1]).toContain(22);
    expect(res[1]).toContain(23);
    expect(res[2]).toContain(31);
    expect(res[2]).toContain(32);
    expect(res[2]).toContain(33);
  });
  it("Works on uneven divisions", () => {
    const res = chunkify([11, 12, 13, 21, 22, 23, 31], 3);
    expect(res).toHaveLength(3);
    expect(res[0]).toHaveLength(3);
    expect(res[1]).toHaveLength(3);
    expect(res[2]).toHaveLength(1);

    expect(res[0]).toContain(11);
    expect(res[0]).toContain(12);
    expect(res[0]).toContain(13);
    expect(res[1]).toContain(21);
    expect(res[1]).toContain(22);
    expect(res[1]).toContain(23);
    expect(res[2]).toContain(31);
  });
});
