import { mapValue } from "../Utilities/mapValue";

type SparkLineDataPoint = { x: number; y: number; hidden?: boolean };
type SparkLineData = SparkLineDataPoint[];

/**
 * Class used to draw Svg SparkLine Path and other relevant components.
 */
export class SvgSparkLinePath {
  static describe(options: {
    data: SparkLineData;
    height: number;
    width: number;
    strokeWidth: number;
    verticalPadding: number;
  }) {
    // Empty data: empty path
    if (options.data.length === 0) {
      return {
        mainPathD: "",
        shadowPathD: "",
        zeroLinePathD: "",
      };
    }

    // Destructure options with shorthands
    const data = options.data;
    const w = options.width;
    const h = options.height;

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
    // inside SVG viewbox. Offset from each edge by half stroke width
    // and from vertical edges by vertical padding.
    function getPoint(datapoint: {
      x: number;
      y: number;
      ignoreVerticalPadding?: boolean;
    }) {
      // Get vertical and horizontal padding.
      // Vertical padding   = stroke / 2 + vertical padding from options unless
      //                      explicitly ignored
      // Horizontal padding = stroke / 2
      const vp =
        options.strokeWidth * 0.5 +
        (datapoint.ignoreVerticalPadding ? 0 : options.verticalPadding);
      const hp = options.strokeWidth * 0.5;

      const x = range_x ? mapValue(datapoint.x, min_x, max_x, hp, w - hp) : 0;
      const y = range_y ? mapValue(datapoint.y, min_y, max_y, h - vp, vp) : 0;

      return `${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    // Find first and last visible datapoints
    let firstVisibleDatapoint: SparkLineDataPoint | undefined;
    let lastVisibleDatapoint: SparkLineDataPoint | undefined;

    for (const datapoint of data) {
      if (!datapoint.hidden) {
        firstVisibleDatapoint = firstVisibleDatapoint ?? datapoint;
        lastVisibleDatapoint = datapoint;
      }
    }

    // If no visible datapoints, return empty
    if (!firstVisibleDatapoint || !lastVisibleDatapoint) {
      return {
        mainPathD: "",
        shadowPathD: "",
        zeroLinePathD: "",
      };
    }

    // Start drawing with initial point
    let mainPathD = `M ${getPoint(firstVisibleDatapoint)} `;
    let shadowPathD = `M ${getPoint(firstVisibleDatapoint)} `;

    // Draw line to each point
    for (const datapoint of data) {
      if (!datapoint.hidden) {
        const nextPoint = `L ${getPoint(datapoint)} `;
        mainPathD += nextPoint;
        shadowPathD += nextPoint;
      }
    }

    // Complete shadow rectangle
    shadowPathD += `L ${getPoint({
      x: lastVisibleDatapoint.x,
      y: min_y,
      ignoreVerticalPadding: true,
    })} `;
    shadowPathD += `L ${getPoint({
      x: firstVisibleDatapoint.x,
      y: min_y,
      ignoreVerticalPadding: true,
    })} `;
    shadowPathD += `L ${getPoint({
      x: firstVisibleDatapoint.x,
      y: firstVisibleDatapoint.y,
    })} `;
    shadowPathD += `z`;

    // Draw zero line
    const zeroY = range_y
      ? mapValue(
          0,
          min_y,
          max_y,
          h - options.verticalPadding,
          options.verticalPadding
        )
      : h / 2;
    const zeroLinePathD = `M 0 ${zeroY} L 0 ${zeroY} L ${w} ${zeroY}`;

    return {
      shadowPathD,
      mainPathD,
      zeroLinePathD,
    };
  }
}
