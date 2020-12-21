import "./AnalyticsAllTimeLine.scss";
import React from "react"
import { useAnalyticsAllTimeLineController } from "./useAnalyticsAllTimeLineController"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { ShowChart as ChartIcon } from "@material-ui/icons"
import { ResponsiveContainer, LineChart, YAxis, Tooltip, Line, CartesianGrid } from "recharts"
import { theme } from "../../../styles/main";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { format } from "date-fns";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";

export type AnalyticsAllTimeLineProps = {
	wrapInAnalyticsBlock?: boolean;
}

export function AnalyticsAllTimeLine(props: AnalyticsAllTimeLineProps) {

	const controller = useAnalyticsAllTimeLineController(props)

	const content = <div className="AnalyticsAllTimeLine">

		<div className="total">
			<Type color="gray-700">
				{`In total you have saved`}
			</Type>
			<MoneyType
				amount={controller.total}
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>

		<ResponsiveContainer height={200} width="100%">
			<LineChart
				data={controller.data}
			>
				<CartesianGrid
					vertical={false}
					color={theme.blue_200}
				/>
				<YAxis
					tickFormatter={(value) => MoneyAmount.largeFormat(Number(value) * 100)}
				/>
				<Tooltip
					formatter={(value) => MoneyAmount.format(Number(value) * 100)}
					labelFormatter={label => format(controller.deserializeMonth(Number(label) + controller.labelOffset), "MMMM, yyyy")}
				/>
				<Line
					strokeWidth={2}
					type="natural"
					dataKey="y"
					stroke={theme.blue_500}
				/>
			</LineChart>
		</ResponsiveContainer>

	</div>

	if (props.wrapInAnalyticsBlock) {
		return <AnalyticsBlock
			header="All time"
			headerIcon={<ChartIcon />}
			children={content}
		/>
	} else {
		return content
	}
}