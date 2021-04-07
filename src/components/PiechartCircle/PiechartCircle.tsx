import "./PiechartCircle.scss";
import React from "react";
import cx from "classnames";
import { usePiechartCircleController } from "./usePiechartCircleController";

export type PiechartCircleProps = {
	/**
	 * Data
	 */
	data: Array<{
		amount: number;
		color: ThemeColor;
		label: string;
	}>

	/**
	 * Size (diameter) in px
	 */
	size?: number;

};

export function PiechartCircle(props: PiechartCircleProps) {

	const controller = usePiechartCircleController(props)

	return <svg
		className={cx(
			"PiechartCircle",
		)}

		height={controller.radius * 2}
		width={controller.radius * 2}
	>
		{
			controller.segments.map(segment => (
				<path
					className={cx(
						"segment",
						`color-${segment.color}`
					)}
					d={getPathD(
						controller.radius,
						segment.percentage,
						segment.cumulativePercentage,
					)}
				/>
			))
		}
	</svg>
}

function getPathD(radius: number, percentage: number, cumulativePercentage: number) {

	// Stroke S and half-stroke s
	const S = 4
	const s = S / 2

	const TAU = 2 * Math.PI;
	const x = Math.max(Math.min(percentage, 99.999), 0) / 100;

	// If empty, simply don't render
	if (x === 0) return ""

	const rad = ((0.75 + x) * TAU) % TAU;
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