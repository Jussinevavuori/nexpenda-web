import "./PiechartCircle.scss";
import React from "react";
import cx from "classnames";
import { usePiechartCircleController } from "./usePiechartCircleController";
import { Angle } from "../../lib/Geometry/Angle";
import { Tooltip } from "@material-ui/core";
import { SvgPath } from "../../lib/Svg/SvgPath";

export type PiechartCircleProps = {
	/**
	 * Data
	 */
	data: Array<{
		amount: number;
		color: Color;
		label: string;
	}>

	/**
	 * Size (diameter) in px
	 */
	size?: number;

	/**
	 * Stroke width in px
	 */
	stroke?: number;


};

export function PiechartCircle(props: PiechartCircleProps) {

	const controller = usePiechartCircleController(props)

	return <svg
		className={cx("PiechartCircle")}
		height={controller.radius * 2}
		width={controller.radius * 2}
	>
		{
			controller.segments.map((segment, i) => (
				<Tooltip
					key={i}
					title={`${segment.label} - ${segment.percentage.toFixed(1)} %`}
				>
					<path
						className={cx("segment", `color-${segment.color}`)}
						style={{ strokeWidth: controller.stroke }}
						d={SvgPath.describePartialCirclePath({
							radius: controller.radius,
							strokeWidth: controller.stroke,
							offsetAngle: new Angle(segment.cumulativePercentage, "percentages"),
							sweepAngle: segment.percentage <= 0 || segment.percentage >= 100
								? new Angle(segment.percentage, "percentages")
								: Angle.add(
									new Angle(segment.percentage, "percentages"),
									new Angle(-22, "degrees")
								),
						})}
					/>
				</Tooltip>
			))
		}
	</svg>
}