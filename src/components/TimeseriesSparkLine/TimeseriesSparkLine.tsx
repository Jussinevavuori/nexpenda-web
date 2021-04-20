import "./TimeseriesSparkLine.scss";
import React from "react";
import { useTimeseriesSparkLineController } from "./useTimeseriesSparkLineController";
import { SparkLine, SparkLineProps } from "../SparkLine/SparkLine";

export type TimeseriesSparkLineProps = {

	/**
	 * Will be mapped to (x,y) points from a series of timestamps
	 * (as in Date.getTime()) and values.
	 */
	data: Array<{
		time: number | Date;
		value: number;
	}>;

	/**
	 * Make the data cumulative?
	 */
	cumulative?: boolean;

	/**
	 * Force a start date?
	 */
	startDate?: Date;

	/**
	 * Force an end date?
	 */
	endDate?: Date;

	/**
	 * Hide values before date.
	 */
	hideValuesBefore?: Date;

	/**
	 * Hide values after date.
	 */
	hideValuesAfter?: Date;

} & Omit<SparkLineProps, "data">;

export function TimeseriesSparkLine(props: TimeseriesSparkLineProps) {

	const controller = useTimeseriesSparkLineController(props)

	return <SparkLine
		{...controller.SparkLineProps}
		data={controller.SparkLineData}
	/>
}