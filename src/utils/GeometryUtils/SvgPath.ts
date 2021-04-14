import { DataUtils } from "../DataUtils/DataUtils";
import { Angle } from "./Angle";
import { GeometryUtils } from "./GeometryUtils";

export class SvgPath {
  /**
   * Generates a SparkLine path. Assumes sorted data. Height and width define
   * viewbox height and width.
   */
  static describeSparkLinePath(options: {
    data: Array<{ x: number; y: number; hidden?: boolean }>;
    height: number;
    width: number;
    strokeWidth: number;
  }) {
    // Empty data: empty path
    if (options.data.length === 0) return "";

    // Destructure options with shorthands
    const data = options.data;
    const w = options.width;
    const h = options.height;
    const s = options.strokeWidth * 0.5; // Half stroke

    // Record minimum and maximum values from data
    let min_x = Number.POSITIVE_INFINITY;
    let min_y = Number.POSITIVE_INFINITY;
    let max_x = Number.NEGATIVE_INFINITY;
    let max_y = Number.NEGATIVE_INFINITY;

    for (const datapoint of data) {
      if (datapoint.x < min_x) min_x = datapoint.x;
      if (datapoint.y < min_y) min_y = datapoint.y;
      if (datapoint.x > max_x) max_x = datapoint.x;
      if (datapoint.y > max_y) max_y = datapoint.y;
    }

    // Calculate ranges of x and y values
    const range_x = max_x - min_x;
    const range_y = max_y - min_y;

    // Map datapoint (x,y pair) to a coordinate pair as string
    // inside SVG viewbox. Offset from each edge by half stroke width.
    function getPoint(datapoint: { x: number; y: number }) {
      const x = range_x
        ? DataUtils.mapValue(datapoint.x, min_x, max_x, s, w - s)
        : 0;
      const y = range_y
        ? DataUtils.mapValue(datapoint.y, min_y, max_y, h - s, s)
        : 0;

      return `${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    // Start drawing with initial point
    let d = `M ${getPoint(data[0])} `;

    // Draw line to each point
    for (const datapoint of data) {
      d += `${datapoint.hidden ? "M" : "L"} ${getPoint(datapoint)} `;
    }

    return d;
  }

  /**
   * Generates a ZeroLine path. Draws a line across a viewbox representing where
   * the given data is zero.
   */
  static describeZeroLinePath(options: {
    data: Array<{ x: number; y: number; hidden?: boolean }>;
    height: number;
    width: number;
    strokeWidth: number;
  }) {
    // Empty data: empty path
    if (options.data.length === 0) return "";

    // Destructure options with shorthands
    const data = options.data;
    const w = options.width;
    const h = options.height;

    // Record minimum and maximum values from data
    let min_y = Number.POSITIVE_INFINITY;
    let max_y = Number.NEGATIVE_INFINITY;

    for (const datapoint of data) {
      if (datapoint.y < min_y) min_y = datapoint.y;
      if (datapoint.y > max_y) max_y = datapoint.y;
    }

    // Calculate range of y values
    const range_y = max_y - min_y;

    // Get height of line
    let y = range_y ? DataUtils.mapValue(0, min_y, max_y, h, 0) : h / 2;

    // Draw line
    return `M 0 ${y} L 0 ${y} L ${w} ${y}`;
  }

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
