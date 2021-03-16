import "./PercentageCircle.scss";
import React from "react";
import cx from "classnames";
import { usePercentageCircleController } from "./usePercentageCircleController";
import { Type, TypeProps } from "../Type/Type";

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
	 * Variant
	 */
	variant?: "income" | "expense";
};

export function PercentageCircle(props: PercentageCircleProps) {
	const controller = usePercentageCircleController(props)

	return <div className={cx(
		"PercentageCircle",
		props.variant ? `variant-${props.variant}` : "",
		{ isOverflow: controller.isOverflow }
	)}>

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
					props.variant ? `variant-${props.variant}` : "",
					{ isOverflow: controller.isOverflow }
				)}
				cx={controller.radius}
				cy={controller.radius}
				r={controller.radius}
			/>
			<path
				className={cx(
					"inactive",
					props.variant ? `variant-${props.variant}` : "",
					{ isOverflow: controller.isOverflow }
				)}
				d={getPathD(controller.radius, 100)}
			/>
			<path
				className={cx(
					"active",
					props.variant ? `variant-${props.variant}` : "",
					{ isOverflow: controller.isOverflow }
				)}
				ref={controller.activeRef}
				d={getPathD(controller.radius, controller.fillPercentage)}
			/>
		</svg>
	</div>
}

function getPathD(radius: number, percentage: number) {

	// Stroke S and half-stroke s
	const S = 4
	const s = S / 2

	const TAU = 2 * Math.PI;
	const x = Math.max(Math.min(percentage, 99.999), 0) / 100;

	// If empty, simply don't render
	if (x === 0) return ""

	const rad = ((0.75 + x) * TAU) % TAU;

	// Quarter 0 : Bottom right
	// Quarter 1 : Bottom left
	// Quarter 2 : Top left
	// Quarter 3 : Top right
	const quarter = Math.floor(rad / (0.25 * TAU));

	return [
		// Start path at top center of circle
		`M${radius},${s}`,

		// Start arc of same size as circle
		`A${radius - s},${radius - s} 1 `,

		// Handle arc flags such that the correct arc is rawn
		["0,1 ", "1,1 ", "1,1 ", "0,1 "][quarter],

		// Ending point of the arc on the circle based on the angle
		`${s + (radius - s) * (1 + Math.cos(rad))},`,
		`${s + (radius - s) * (1 + Math.sin(rad))}`,
	].join("")

}