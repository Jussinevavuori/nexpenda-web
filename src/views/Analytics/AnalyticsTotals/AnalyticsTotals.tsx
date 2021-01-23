import "./AnalyticsTotals.scss";
import React from "react"
import { useAnalyticsTotalsController } from "./useAnalyticsTotalsController"
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { Functions as TotalsIcon } from "@material-ui/icons"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";

export type AnalyticsTotalsProps = {
	wrapInAnalyticsBlock?: boolean;
}

export function AnalyticsTotals(props: AnalyticsTotalsProps) {

	const controller = useAnalyticsTotalsController(props)

	const content = <div className="AnalyticsTotals">
		<div className="header">
			<Type color="gray-600" variant="boldcaps">
				{"Total"}
			</Type>
			<Type color="gray-600" size="md">
				{`(${controller.totals.totalCount} transactions)`}
			</Type>
		</div>
		<div className="total">
			<MoneyType
				animate
				amount={controller.totals.total}
				size="xxl"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="subtotals">
			<MoneyType
				animate
				amount={controller.totals.incomes}
				size="lg"
				variant="regular"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
			<Type color="gray-800" size="md">{"/"}</Type>
			<MoneyType
				animate
				amount={controller.totals.expenses}
				size="lg"
				variant="regular"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
	</div >

	if (props.wrapInAnalyticsBlock) {
		return <AnalyticsBlock
			header="Totals"
			headerIcon={<TotalsIcon />}
			children={content}
		/>
	} else {
		return content
	}
}