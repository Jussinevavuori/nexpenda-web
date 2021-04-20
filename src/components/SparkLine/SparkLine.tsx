import "./SparkLine.scss";
import React from "react";
import cx from "classnames";
import { useSparkLineController } from "./useSparkLineController";
import { SvgPath } from "../../utils/GeometryUtils/SvgPath";

export type SparkLineProps = {

	/**
	 * The provided data as series of x,y-points.
	 */
	data: Array<{ x: number; y: number; hidden?: boolean; }>;

	/**
	 * Optional color of sparkline. Defaults to `primary-500`.
	 */
	color?: ThemeColor;

	/**
	 * Optional height ratio. Defines viewbox size. Defaults to 2.00.
	 * Example values:
	 * 
	 * 1.78 = 16 / 9 (default screen aspect ratio)
	 * 1.00 = 1 / 1  (square)
	 * 0.50 = 1 / 2  (two tall, one wide)
	 * 2.00 = 2 / 1  (two wide, one tall)
	 */
	aspectRatio?: number;

	/**
	 * Stroke width in px. Defaults to `2`.
	 */
	strokeWidth?: number;

	/**
	 * Render zero line?
	 */
	showZeroLine?: boolean;

	/**
	 * Zero line stroke width. Defaults to sparkline's stroke width
	 */
	zerolineStrokeWidth?: number;

	/**
	 * Zero line color. Defaults to a gray color.
	 */
	zerolineColor?: ThemeColor;
};

export function SparkLine(props: SparkLineProps) {

	const controller = useSparkLineController(props)

	return <div className={cx("SparkLine")}>
		<svg
			viewBox={`0 0 ${controller.viewBox.width} ${controller.viewBox.height}`}
		>

			{
				props.showZeroLine && <path
					className={cx("zeroline", `color-${props.zerolineColor ?? "gray-300"}`)}
					strokeWidth={props.zerolineStrokeWidth ?? controller.strokeWidth}
					d={SvgPath.describeZeroLinePath({
						data: controller.sortedData,
						height: controller.viewBox.height,
						width: controller.viewBox.width,
						strokeWidth: props.zerolineStrokeWidth ?? controller.strokeWidth,
					})}
				/>
			}
			<path
				className={cx("sparkline", `color-${props.color ?? "primary-500"}`)}
				strokeWidth={controller.strokeWidth}
				d={SvgPath.describeSparkLinePath({
					data: controller.sortedData,
					height: controller.viewBox.height,
					width: controller.viewBox.width,
					strokeWidth: controller.strokeWidth,
				})}
			/>
		</svg>
	</div>
}
