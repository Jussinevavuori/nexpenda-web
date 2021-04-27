import "./SparkLine.scss";
import React from "react";
import cx from "classnames";
import { SparkLineDefaults, useSparkLineController } from "./useSparkLineController";

export type SparkLineProps = {

	/**
	 * The provided data as series of x,y-points.
	 */
	data: Array<{ x: number; y: number; hidden?: boolean; }>;

	/**
	 * Optional color of sparkline. Defaults to `primary-500`.
	 */
	color?: Color;

	/**
	 * Optional color of sparkline shadow. Defaults to `primary-200`.
	 */
	shadowColor?: Color;

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
	 * Hide shadow?
	 */
	hideShadow?: boolean;

	/**
	 * Amount of vertical padding in sparkline
	 */
	verticalPadding?: number;

	/**
	 * Zero line stroke width. Defaults to sparkline's stroke width
	 */
	zerolineStrokeWidth?: number;

	/**
	 * Zero line color. Defaults to a gray color.
	 */
	zerolineColor?: Color;

	/**
	 * Shadow gradient opacity stops
	 */
	shadowOpacityStops?: typeof SparkLineDefaults["GradientStops"];
};

export function SparkLine(props: SparkLineProps) {

	const controller = useSparkLineController(props)

	return <div className={cx("SparkLine")}>
		<svg
			viewBox={`0 0 ${controller.viewBox.width} ${controller.viewBox.height}`}
		>

			<defs>
				<linearGradient
					id="SparkLine__gradient"
					gradientTransform="rotate(90)"
				>
					{
						(props.shadowOpacityStops ?? SparkLineDefaults.GradientStops).map(stop => (
							<stop
								key={stop.percentage}
								offset={`${stop.percentage}%`}
								className={props.shadowColor ?? "primary-200"}
								stopOpacity={stop.opacity}
							/>
						))
					}
				</linearGradient>
			</defs>

			{
				!props.hideShadow &&
				<path
					className={cx("sparkline-shadow")}
					d={controller.svgPath.shadowPathD}
					fill="url(#SparkLine__gradient) #ffffff"
				/>
			}
			{
				props.showZeroLine && <path
					className={cx("zeroline", `stroke-${props.zerolineColor ?? "gray-300"}`)}
					strokeWidth={controller.zerolineStrokeWidth}
					d={controller.svgPath.zeroLinePathD}
				/>
			}
			<path
				className={cx("sparkline", `stroke-${props.color ?? "primary-500"}`)}
				strokeWidth={controller.strokeWidth}
				d={controller.svgPath.mainPathD}
			/>
		</svg>
	</div>
}
