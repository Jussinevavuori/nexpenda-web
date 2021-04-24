import { SvgPartialCirclePath } from "./SvgPartialCirclePath";
import { SvgSparkLinePath } from "./SvgSparkLinePath";

export class SvgPath {
  /**
   * Describe a spark line path using the `SvgSparkLinePath` class.
   */
  static describeSparkLinePath = SvgSparkLinePath.describe;

  /**
   * Describes a partial circle path using the `SvgPartialCirclePath` class.
   */
  static describePartialCirclePath = SvgPartialCirclePath.describe;
}
