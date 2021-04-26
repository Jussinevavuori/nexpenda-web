export class SvgCornerPiecePath {
  static describe(options: {
    size: number;
    position: `${"bottom" | "top"}-${"left" | "right"}`;
  }) {
    const S = options.size;

    let origin = { x: 0, y: 0 };
    let first = { x: 0, y: 0 };
    let second = { x: 0, y: 0 };

    switch (options.position) {
      case "top-left":
        origin = { x: 0, y: 0 };
        first = { x: S, y: 0 };
        second = { x: 0, y: S };
        break;
      case "top-right":
        origin = { x: S, y: 0 };
        first = { x: 0, y: 0 };
        second = { x: S, y: S };
        break;
      case "bottom-left":
        origin = { x: 0, y: S };
        first = { x: S, y: S };
        second = { x: 0, y: 0 };
        break;
      case "bottom-right":
        origin = { x: S, y: S };
        first = { x: 0, y: S };
        second = { x: S, y: 0 };
        break;
    }

    return `
			M ${origin.x} ${origin.y}
			L ${first.x}  ${first.y}
			Q ${origin.x} ${origin.y} ${second.x} ${second.y}
			L ${origin.x} ${origin.y}
		`;
  }
}
