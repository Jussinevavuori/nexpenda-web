export type Color = RgbColor | HslColor;

/**
 * Color base class
 */
export abstract class BaseColor {
  /**
   * Clamp a value between the min and max values.
   */
  protected clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }

  /**
   * Converts the current color to an RGB color
   */
  abstract toRgb(): RgbColor;

  /**
   * Converts the current color to an HSL color
   */
  abstract toHsl(): HslColor;
}

/**
 * RGB color
 */
export class RgbColor extends BaseColor {
  /**
   * Red value between 0 and 255
   */
  r: number;

  /**
   * Green value between 0 and 255
   */
  g: number;

  /**
   * Blue value between 0 and 255
   */
  b: number;

  /**
   * Create an RGB from three values, the R, G and B
   * values, each one which is expected and clamped to be in
   * the range between 0 and 255.
   *
   * @param r Red value (0 - 255)
   * @param g Green value (0 - 255)
   * @param b Blue value (0 - 255)
   */
  constructor(r: number, g: number, b: number) {
    super();
    this.r = this.clamp(r, 0, 255);
    this.g = this.clamp(g, 0, 255);
    this.b = this.clamp(b, 0, 255);
  }

  /**
   * Return #rrggbb hex string representation.
   */
  toHexString(options?: { omitHash?: boolean }): string {
    const rr = Math.floor(this.r).toString(16).padStart(2, "0");
    const gg = Math.floor(this.g).toString(16).padStart(2, "0");
    const bb = Math.floor(this.b).toString(16).padStart(2, "0");
    const prefix = options?.omitHash ? "" : "#";
    return `${prefix}${rr}${gg}${bb}`;
  }

  toRgb(): RgbColor {
    return this;
  }

  toHsl(): HslColor {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = (max + min) / 2;
    let s = h;
    let l = h;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return new HslColor(h * 360, s * 100, l * 100);
  }
}

export class HslColor extends BaseColor {
  /**
   * Hue angle between 0 and 360
   */
  h: number;

  /**
   * Saturation value between 0 and 100
   */
  s: number;

  /**
   * Luminosity value between 0 and 100
   */
  l: number;

  /**
   * Create an HSL from three values, the H, S and L
   * values, where the hue H is "moduloed" to be in the
   * range of 0 - 360 (H % 360) and and the saturation S and
   * lightness L are expected and clamped to be in the
   * range between 0 and 100.
   *
   * @param h Red value (0 - 360)
   * @param s Green value (0 - 100)
   * @param l Blue value (0 - 100)
   */
  constructor(h: number, s: number, l: number) {
    super();
    this.h = h % 360;
    this.s = this.clamp(s, 0, 100);
    this.l = this.clamp(l, 0, 100);
  }

  toHexString(): string {
    return this.toRgb().toHexString();
  }

  toHsl(): HslColor {
    return this;
  }

  toRgb(): RgbColor {
    const h = this.h / 360;
    const s = this.s / 100;
    const l = this.l / 100;
    let r = 0;
    let g = 0;
    let b = 0;

    if (s === 0) {
      return new RgbColor(l * 255, l * 255, l * 255);
    } else {
      const _ = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = _(p, q, h + 1 / 3);
      g = _(p, q, h);
      b = _(p, q, h - 1 / 3);

      return new RgbColor(r * 255, g * 255, b * 255);
    }
  }

  /**
   * Takes in any string, and maps it deterministically to
   * a value, which is used as the hue value. The values of
   * saturation and lightness can be set manually in the options.
   *
   * @param string String to use as seed for generating hue
   * @param options Options for generating color
   */
  static getRandomColorFromString(
    string: string,
    options?: {
      saturation: number;
      lightness: number;
    }
  ): HslColor {
    const h = Array.from(string)
      .map((_) => _.charCodeAt(0) ?? 0)
      .reduce((sum, code) => sum + code, 0);
    const s = options?.saturation ?? 50;
    const l = options?.lightness ?? 75;
    return new HslColor(h, s, l);
  }
}
