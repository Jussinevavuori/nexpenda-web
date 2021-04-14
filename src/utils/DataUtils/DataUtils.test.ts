/**
 * Map value test
 */

import { DataUtils } from "./DataUtils";

describe("DataUtils.mapValue", () => {
  const _ = DataUtils.mapValue;

  it("Correctly maps between positive ranges", () => {
    expect(_(0, 0, 100, 0, 1)).toBeCloseTo(0);
    expect(_(50, 0, 100, 0, 1)).toBeCloseTo(0.5);
    expect(_(100, 0, 100, 0, 1)).toBeCloseTo(1);
  });

  it("Correctly clamps or overflows", () => {
    expect(_(2, 0, 1, 0, 100)).toBeCloseTo(200);
    expect(_(2, 0, 1, 0, 100, { clamp: true })).toBeCloseTo(100);
  });

  it("Correctly maps between negative ranges", () => {
    expect(_(-2, -1, -3, 2, 6)).toBeCloseTo(4);
    expect(_(-75, -50, -100, 1, 2)).toBeCloseTo(1.5);
  });

  it("Correctly reflects ranges", () => {
    expect(_(10, 0, 100, 100, 0)).toBeCloseTo(90);
    expect(_(10, 0, 100, -20, -10)).toBeCloseTo(-19);
  });
});
