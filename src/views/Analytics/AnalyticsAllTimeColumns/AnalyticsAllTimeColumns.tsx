import "./AnalyticsAllTimeColumns.scss";
import React from "react";
import cx from "classnames";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { format } from "date-fns";
import { useAnalyticsAllTimeColumnsController } from "./useAnalyticsAllTimeColumnsController";
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { Bar, CartesianGrid, ResponsiveContainer, ComposedChart, YAxis, Tooltip, Line } from "recharts";
import { theme } from "../../../styles/main";

export type AnalyticsAllTimeColumnsProps = {

};


export function AnalyticsAllTimeColumns(props: AnalyticsAllTimeColumnsProps) {

	const controller = useAnalyticsAllTimeColumnsController(props)

	return <>
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
