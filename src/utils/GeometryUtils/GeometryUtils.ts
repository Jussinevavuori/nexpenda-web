import { Angle } from "./Angle";

export class GeometryUtils {
  /**
   * Transforms from polar coordinates to cartesian coordinates
   */
  static polarToCartesian(args: {
    center: { x: number; y: number };
    radius: number;
    angle: Angle;
  }) {
    const offsetAngle = new Angle(-90, "degrees");
    const radians = Angle.add(args.angle, offsetAngle).radians;

    return {
      x: args.center.x + args.radius * Math.cos(radians),
      y: args.center.y + args.radius * Math.sin(radians),
    };
  }
}
