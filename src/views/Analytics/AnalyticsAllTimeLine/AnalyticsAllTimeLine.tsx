import "./AnalyticsAllTimeLine.scss";
import React from "react"
import { useAnalyticsAllTimeLineController } from "./useAnalyticsAllTimeLineController"
import { ResponsiveContainer, LineChart, YAxis, Tooltip, Line, CartesianGrid } from "recharts"
import { theme } from "../../../styles/main";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { format } from "date-fns";
import { ContainerBlock } from "../../../components/Container/ContainerBlock";

export type AnalyticsAllTimeLineProps = {
}

export function AnalyticsAllTimeLine(props: AnalyticsAllTimeLineProps) {

	const controller = useAnalyticsAllTimeLineController(props)

	return <ContainerBlock containerTitle="All time">
		<div className="AnalyticsAllTimeLine">
			<div className="chart">
				<ResponsiveContainer height={200} width="100%">

					<LineChart
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
							strokeWidth={2}
							type="natural"
							dataKey="y"
							stroke={theme.blue_400}
						/>
					</LineChart>
				</ResponsiveContainer>

			</div>
		</div>
	</ContainerBlock>
}