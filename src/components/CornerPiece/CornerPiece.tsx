import "./CornerPiece.scss";
import React from "react";
import cx from "classnames";
import { SvgPath } from "../../utils/SvgUtils/SvgPath";

export type CornerPieceProps = {
	fill: Color;
	className?: string;
	pathClassName?: string;
	size?: number;
	position: Parameters<typeof SvgPath["describeCornerPiecePath"]>[0]["position"]
	variant: Parameters<typeof SvgPath["describeCornerPiecePath"]>[0]["variant"]
};

export function CornerPiece(props: CornerPieceProps) {

	const size = props.size ?? CornerPieceDefaultSize

	return <svg
		className={cx("CornerPiece", props.className, `fill-${props.fill}`)}
		viewBox={`0 0 ${size} ${size}`}
		style={{ width: size, height: size }}
	>
		<path
			className={cx(props.pathClassName)}
			d={
				SvgPath.describeCornerPiecePath({
					size: size,
					position: props.position,
					variant: props.variant,
				})
			}
		/>
	</svg>
}

export const CornerPieceDefaultSize = 16