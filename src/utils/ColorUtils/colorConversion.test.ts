import { RgbColor } from "./Color";

const colorConversionTables = {
  black: { r: 0, g: 0, b: 0, h: 0, s: 0, l: 0 },
  white: { r: 255, g: 255, b: 255, h: 0, s: 0, l: 100 },
  red: { r: 255, g: 0, b: 0, h: 0, s: 100, l: 50 },
  lime: { r: 0, g: 255, b: 255, h: 120, s: 100, l: 50 },
  blue: { r: 0, g: 0, b: 255, h: 240, s: 100, l: 50 },
  yellow: { r: 255, g: 255, b: 0, h: 60, s: 100, l: 50 },
  cyan: { r: 0, g: 255, b: 255, h: 180, s: 100, l: 50 },
  magenta: { r: 255, g: 0, b: 255, h: 300, s: 100, l: 50 },
  silver: { r: 191, g: 191, b: 191, h: 0, s: 0, l: 75 },
  gray: { r: 128, g: 128, b: 128, h: 0, s: 0, l: 50 },
  maroon: { r: 128, g: 0, b: 0, h: 0, s: 100, l: 25 },
  olive: { r: 128, g: 128, b: 0, h: 60, s: 100, l: 25 },
  green: { r: 0, g: 128, b: 0, h: 120, s: 100, l: 25 },
  purple: { r: 128, g: 0, b: 128, h: 300, s: 100, l: 25 },
  teal: { r: 0, g: 128, b: 128, h: 180, s: 100, l: 25 },
  navy: { r: 0, g: 0, b: 128, h: 240, s: 100, l: 25 },
} as const;

describe("colorConversion", () => {
  it("converts black", () => {
    const C = colorConversionTables.black;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts white", () => {
    const C = colorConversionTables.white;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts red", () => {
    const C = colorConversionTables.red;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts lime", () => {
    const C = colorConversionTables.lime;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts blue", () => {
    const C = colorConversionTables.blue;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts yellow", () => {
    const C = colorConversionTables.yellow;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts cyan", () => {
    const C = colorConversionTables.cyan;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts magenta", () => {
    const C = colorConversionTables.magenta;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts silver", () => {
    const C = colorConversionTables.silver;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts gray", () => {
    const C = colorConversionTables.gray;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts maroon", () => {
    const C = colorConversionTables.maroon;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts olive", () => {
    const C = colorConversionTables.olive;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts green", () => {
    const C = colorConversionTables.green;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts purple", () => {
    const C = colorConversionTables.purple;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts teal", () => {
    const C = colorConversionTables.teal;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
  it("converts navy", () => {
    const C = colorConversionTables.navy;
    const color = new RgbColor(C.r, C.g, C.b);
    const hsl = color.toHsl();
    const rgb = hsl.toRgb();
    expect(hsl.h).toBeCloseTo(C.h, 0);
    expect(hsl.s).toBeCloseTo(C.s, 0);
    expect(hsl.l).toBeCloseTo(C.l, 0);
    expect(rgb.r).toBeCloseTo(C.r, 0);
    expect(rgb.g).toBeCloseTo(C.g, 0);
    expect(rgb.b).toBeCloseTo(C.b, 0);
  });
});
