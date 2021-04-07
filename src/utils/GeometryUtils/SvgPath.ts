import { Angle } from "./Angle";
import { GeometryUtils } from "./GeometryUtils";

export class SvgPath {
  /**
   * Generates a SVG path d-string for a partial circle, based
   * on the given options.
   */
  static describePartialCircle(options: {
    radius: number;
    strokeWidth: number;
    sweepAngle: Angle;
    offsetAngle: Angle;
  }): string {
    // Parse angles to radians
    const sweep = options.sweepAngle.radians;

    // Shorthands to half-stroke (s) and radius (R)
    const s = options.strokeWidth / 2;
    const R = options.radius;

    // Empty angle does not generate a path
    if (sweep <= 0) return "";

    // Starting point
    const start = GeometryUtils.polarToCartesian({
      center: { x: R, y: R },
      angle: Angle.add(options.offsetAngle, options.sweepAngle),
      radius: R - s,
    });

    // Ending point
    const end = GeometryUtils.polarToCartesian({
      center: { x: R, y: R },
      angle: options.offsetAngle,
      radius: R - s,
    });

    return [
      // We offset the ending point slightly
      // slightly from the starting point in case
      // they are equal. This ensures we can draw
      // a full circle. If the ending point and
      // starting point are the same, the arc
      // would not be drawn.

      // Starting point
      "M",
      start.x,
      start.y,

      // Arc to ending point
      "A",
      R - s,
      R - s,
      0,
      sweep <= Math.PI ? 0 : 1,
      0,
      end.x + 1e-6,
      end.y,
    ].join(" ");
  }
}
