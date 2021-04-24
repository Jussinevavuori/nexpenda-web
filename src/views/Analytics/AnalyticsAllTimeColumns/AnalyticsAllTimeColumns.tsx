import "./AnalyticsAllTimeColumns.scss";
import React from "react";
import cx from "classnames";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { format } from "date-fns";
import { useAnalyticsAllTimeColumnsController } from "./useAnalyticsAllTimeColumnsController";
import { Bar, CartesianGrid, ResponsiveContainer, ComposedChart, YAxis, Tooltip, Line } from "recharts";
import { theme } from "../../../styles/main";
import { ContainerBlock } from "../../../components/Container/ContainerBlock";

export type AnalyticsAllTimeColumnsProps = {

};


export function AnalyticsAllTimeColumns(props: AnalyticsAllTimeColumnsProps) {

	const controller = useAnalyticsAllTimeColumnsController(props)

	return <>
		<ContainerBlock containerTitle="Monthly totals" >
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
							<Line
								dataKey="Total"
								stroke={theme.gray_800}
								strokeWidth={4}
							/>
							<Bar
								dataKey="Incomes"
								fill={theme.green_500}
								stackId="stack"
								radius={10}
							/>
							<Bar
								dataKey="Expenses"
								fill={theme.red_500}
								stackId="stack"
								radius={10}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</ContainerBlock>
	</>
}
