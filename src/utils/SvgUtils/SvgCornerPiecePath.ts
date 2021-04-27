import { Vector2 } from "../GeometryUtils/Vector2";

export class SvgCornerPiecePath {
  static describe(options: {
    size: number;
    position: `${"bottom" | "top"}-${"left" | "right"}`;
    variant: "internal" | "external";
  }) {
    // Shorthand S for size
    const S = options.size;

    // All four points of a square as follows (in the example of top-left)
    //
    // A -- B
    // |    |
    // C -- D
    //
    // Such that the drawing starts from A and first goes to B, then to C
    // curving either towards A or D and finishes back to A.
    let A, B, C, D: Vector2;

    // Get the four points depending on the position
    switch (options.position) {
      case "top-left":
        A = new Vector2(0, 0);
        B = new Vector2(S, 0);
        C = new Vector2(0, S);
        D = new Vector2(S, S);
        break;
      case "top-right":
        A = new Vector2(S, 0);
        B = new Vector2(0, 0);
        C = new Vector2(S, S);
        D = new Vector2(0, S);
        break;
      case "bottom-left":
        A = new Vector2(0, S);
        B = new Vector2(S, S);
        C = new Vector2(0, 0);
        D = new Vector2(S, 0);
        break;
      case "bottom-right":
        A = new Vector2(S, S);
        B = new Vector2(0, S);
        C = new Vector2(S, 0);
        D = new Vector2(0, 0);
        break;
    }

    // Draw path depending on variant and four points
    switch (options.variant) {
      case "internal":
        return [
          `M ${A.x} ${A.y}`, // Move to origin A
          `L ${B.x}  ${B.y}`, // Draw line to next point B
          `Q ${A.x} ${A.y} ${C.x} ${C.y}`, // Draw curve to C and curve internally towards A
          `L ${A.x} ${A.y}`, // Finish and draw line back to A
        ].join(" ");
      case "external":
        return [
          `M ${A.x} ${A.y}`, // Move to origin A
          `L ${B.x}  ${B.y}`, // Draw line to next point B
          `Q ${D.x} ${D.y} ${C.x} ${C.y}`, // Draw curve to C and curve externally towards D
          `L ${A.x} ${A.y}`, // Finish and draw line back to A
        ].join(" ");
    }
  }
}
