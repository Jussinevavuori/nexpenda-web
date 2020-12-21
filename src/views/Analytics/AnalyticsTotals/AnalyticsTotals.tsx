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
		<div className="total">
			<Type color="gray-600" variant="boldcaps">
				{"Total"}
			</Type>
			<MoneyType
				animate
				amount={controller.totals.all}
				size="xxl"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="subtotal">
			<Type color="gray-600" variant="boldcaps">
				{"Total incomes"}
			</Type>
			<MoneyType
				animate
				amount={controller.totals.incomes}
				size="lg"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="subtotal">
			<Type color="gray-600" variant="boldcaps">
				{"Total expenses"}
			</Type>
			<MoneyType
				animate
				amount={controller.totals.expenses}
				size="lg"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div >
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