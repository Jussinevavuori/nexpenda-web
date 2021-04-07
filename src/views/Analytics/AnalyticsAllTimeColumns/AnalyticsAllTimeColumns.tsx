import "./AnalyticsAllTimeColumns.scss";
import React from "react";
import cx from "classnames";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { format } from "date-fns";
import { useAnalyticsAllTimeColumnsController } from "./useAnalyticsAllTimeColumnsController";
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { Button, ButtonGroup } from "@material-ui/core";
import { Bar, CartesianGrid, ResponsiveContainer, ComposedChart, YAxis, Tooltip, Line } from "recharts";
import { theme } from "../../../styles/main";

export type AnalyticsAllTimeColumnsProps = {

};


export function AnalyticsAllTimeColumns(props: AnalyticsAllTimeColumnsProps) {

	const controller = useAnalyticsAllTimeColumnsController(props)

	const SVG = {
		width: 6,
		spacing: 6,
		rounding: 4,
		height: 240,
		max: controller.scale.max,
		min: controller.scale.min,
		range: controller.scale.max - controller.scale.min,
		getXOffsetPx(index: number, ops: { centered?: boolean } = {}) {
			let x = index * (this.spacing + this.width)
			if (ops.centered) {
				x = x + (this.width / 2)
			}
			return x
		},
		getYOffsetPx(ops: {} = {}) {
			let y = this.height * this.max / this.range
			return y
		},
		getWidthPx(ops: { removeRounding?: number } = {}) {
			let w = this.width
			if (ops.removeRounding) {
				w = removeLength(w, ops.removeRounding * this.rounding)
			}
			return w
		},
		getHeightPx(value: number, ops: { removeRounding?: number, abs?: true } = {}) {
			let h = this.height * value / this.range
			if (ops.abs) {
				h = Math.abs(h)
			}
			if (ops.removeRounding) {
				h = removeLength(h, ops.removeRounding * this.rounding)
			}
			return h
		},
	}

	return <>
		{
			process.env.NODE_ENV === "development" &&
			<AnalyticsBlock
				header="Monthly totals DEV"
				headerContent={<div className="AnalyticsAllTimeColumns__headerContent">
					<ButtonGroup size="small">
						<Button
							color="primary"
							size="small"
							variant={controller.isShowingTotal ? "outlined" : "contained"}
							onClick={() => controller.setIsShowingTotal(false)}
						>
							{"±"}
						</Button>
						<Button
							color="primary"
							size="small"
							variant={controller.isShowingTotal ? "contained" : "outlined"}
							onClick={() => controller.setIsShowingTotal(true)}
						>
							{"="}
						</Button>
					</ButtonGroup>
				</div>}
			>
				<div className={cx("DEV__AnalyticsAllTimeColumns")}>
					<svg width="100%" height={SVG.height}>
						{
							!controller.isShowingTotal &&
							controller.data.map((point, i) => <path
								key={point.name}
								fill={theme.green_500}
								d={[
									`M ${SVG.getXOffsetPx(i)} ${SVG.getYOffsetPx()}`,
									`v ${-SVG.getHeightPx(point.Incomes, { removeRounding: 1, abs: true })}`,
									`q0,${-SVG.rounding} ${SVG.rounding},${-SVG.rounding}`,
									`h ${SVG.getWidthPx({ removeRounding: 2 })}`,
									`q${SVG.rounding},0 ${SVG.rounding},${SVG.rounding}`,
									`v ${SVG.getHeightPx(point.Incomes, { removeRounding: 1, abs: true })}`,
									`h ${-SVG.getWidthPx()}`,
								].join(" ")}
							/>)
						}
						{
							!controller.isShowingTotal &&
							controller.data.map((point, i) => <path
								key={point.name}
								fill={theme.red_400}
								d={[
									`M ${SVG.getXOffsetPx(i)},${SVG.getYOffsetPx()}`,
									`v ${SVG.getHeightPx(point.Expenses, { removeRounding: 1, abs: true })}`,
									`q0,${SVG.rounding} ${SVG.rounding},${SVG.rounding}`,
									`h ${SVG.getWidthPx({ removeRounding: 2 })}`,
									`q${SVG.rounding},0 ${SVG.rounding},${-SVG.rounding}`,
									`v ${-SVG.getHeightPx(point.Expenses, { removeRounding: 1, abs: true })}`,
									`h ${-SVG.getWidthPx()}`,
								].join(" ")}
							/>)
						}
						{
							controller.isShowingTotal &&
							controller.data.map((point, i) => point.Total > 0
								? <rect
									key={i}
									fill={theme.green_500}
									x={SVG.getXOffsetPx(i)}
									y={SVG.getYOffsetPx() - SVG.getHeightPx(point.Total, { abs: true })}
									height={SVG.getHeightPx(point.Total, { abs: true })}
									width={SVG.getWidthPx()}
									rx={SVG.rounding}
								/>
								: <rect
									key={i}
									fill={theme.red_400}
									x={SVG.getXOffsetPx(i)}
									y={SVG.getYOffsetPx()}
									height={SVG.getHeightPx(point.Total, { abs: true })}
									width={SVG.getWidthPx()}
									rx={SVG.rounding}
								/>
							)
						}
					</svg>
				</div>
			</AnalyticsBlock>

		}
		<AnalyticsBlock header="Monthly totals" >
			<div className={cx("AnalyticsAllTimeColumns")}>
				<div className="chart">
					<ResponsiveContainer height={250} width="100%">
						<ComposedChart
							stackOffset="sign"
							data={controller.data}
						>
							<CartesianGrid
								vertical={false}
								color={theme.blue_200}
							/>
							<YAxis
								tickLine={false}
								tickFormatter={(value) => MoneyAmount.largeFormat(Number(value))}
							/>
							<Tooltip
								formatter={(value: any) => MoneyAmount.format(Number(value))}
								labelFormatter={label => format(controller.deserializeMonth(Number(label) + controller.labelOffset), "MMMM, yyyy")}
							/>
							<Bar
								dataKey="Incomes"
								fill={theme.green_300}
								stackId="stack"
							/>
							<Bar
								dataKey="Expenses"
								fill={theme.red_300}
								stackId="stack"
							/>
							<Line
								dataKey="Total"
								stroke={theme.blue_300}
								strokeWidth={2}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</AnalyticsBlock>
	</>
}

function removeLength(original: number, remove: number): number {
	const sign = original >= 0 ? 1 : -1
	const value = Math.max(0, Math.abs(original) - Math.abs(remove))
	return sign * value
}