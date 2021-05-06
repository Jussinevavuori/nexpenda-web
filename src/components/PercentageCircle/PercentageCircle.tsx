import "./PercentageCircle.scss";
import React from "react";
import cx from "classnames";
import { usePercentageCircleController } from "./usePercentageCircleController";
import { Type, TypeProps } from "../Type/Type";
import { SvgPath } from "../../utils/SvgUtils/SvgPath";
import { Angle } from "../../utils/GeometryUtils/Angle";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type PercentageCircleProps = {
	/**
	 * Non-negative number. Can go over 100.
	 */
	percentage: number;

	/**
	 * Size (diameter) in px
	 */
	size?: number;

	/**
	 * Props for the label element
	 */
	labelProps?: TypeProps;

	/**
	 * Class name
	 */
	className?: string;

	/**
	 * Optional background color.
	 */
	backgroundColor?: Color;

	/**
	 * Optional inactive percentage color (color of unfilled part of circle).
	 */
	unfilledColor?: Color;

	/**
	 * Optional active percentage color (color of filled part of circle).
	 */
	filledColor?: Color;
};

export function PercentageCircle(props: PercentageCircleProps) {
	const controller = usePercentageCircleController(props)
	const isDarkTheme = useIsDarkTheme()

	return <div
		className={cx(
			"PercentageCircle",
			{ isOverflow: controller.isOverflow },
			props.className
		)}
		style={{ width: 2 * controller.radius, height: 2 * controller.radius }}
	>

		<Type
			component="label"
			size="sm"
			variant="bold"
			{...props.labelProps}
		>
			{controller.percentage.toFixed(0) + "%"}
		</Type>

		<svg
			height={controller.radius * 2}
			width={controller.radius * 2}
		>
			<circle
				className={cx(
					"background",
					{ isOverflow: controller.isOverflow },
					`color-${props.backgroundColor || "transparent"}`
				)}
				cx={controller.radius}
				cy={controller.radius}
				r={controller.radius}
			/>
			<path
				className={cx(
					"inactive",
					{ isOverflow: controller.isOverflow },
					`color-${props.unfilledColor || (isDarkTheme ? "primary-900" : "primary-200")}`
				)}
				d={SvgPath.describePartialCirclePath({
					radius: controller.radius,
					offsetAngle: new Angle(0, "percentages"),
					sweepAngle: new Angle(100, "percentages"),
					strokeWidth: 4,
				})}

			/>
			<path
				className={cx(
					"active",
					{ isOverflow: controller.isOverflow },
					`color-${props.filledColor || (isDarkTheme ? "primary-500" : "primary-500")}`
				)}
				ref={controller.activeRef}
				d={SvgPath.describePartialCirclePath({
					radius: controller.radius,
					offsetAngle: new Angle(0, "percentages"),
					sweepAngle: new Angle(controller.fillPercentage, "percentages"),
					strokeWidth: 4,
				})}
			/>
		</svg>
	</div>
}