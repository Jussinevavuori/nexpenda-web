import "./AnalyticsMonthlyAverages.scss";
import React from "react"
import { useAnalyticsMonthlyAveragesController } from "./useAnalyticsMonthlyAveragesController"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { DateRange } from "@material-ui/icons";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { MenuItem, Select } from "@material-ui/core";

export type AnalyticsMonthlyAveragesProps = {
	wrapInAnalyticsBlock?: boolean;
}

export function AnalyticsMonthlyAverages(props: AnalyticsMonthlyAveragesProps) {

	const controller = useAnalyticsMonthlyAveragesController(props)

	const content = <div className="AnalyticsMonthlyAverages">
		<div className="header">
			<Type color="gray-600" variant="boldcaps">
				{"Average monthly total"}
			</Type>
		</div>
		<div className="total">
			<MoneyType
				animate
				amount={controller.activeAverage.total}
				size="xxl"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="subtotals">
			<MoneyType
				animate
				amount={controller.activeAverage.incomes}
				size="lg"
				variant="regular"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
			<Type color="gray-800" size="md">{"/"}</Type>
			<MoneyType
				animate
				amount={controller.activeAverage.expenses}
				size="lg"
				variant="regular"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="select">
			<Select
				value={controller.activeTimerange.id}
				fullWidth
				variant="outlined"
			>
				{
					controller.timeranges.map(tr => {
						const handleClick = () => {
							if (typeof tr.id === "number") return
							controller.setActiveTimerangeId(tr.id)
						}
						return <MenuItem
							value={tr.id}
							key={tr.id}
							onClick={handleClick}
							children={tr.label}
						/>
					})
				}
			</Select>
		</div>
	</div>

	if (props.wrapInAnalyticsBlock) {
		return <AnalyticsBlock
			header="Monthly averages"
			headerIcon={<DateRange />}
			children={content}
		/>
	} else {
		return content
	}
}