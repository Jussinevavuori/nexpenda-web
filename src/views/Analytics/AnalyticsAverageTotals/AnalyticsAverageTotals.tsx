import "./AnalyticsAverageTotals.scss";
import React from "react";
import cx from "classnames";
import { useAnalyticsAverageTotalsController } from "./useAnalyticsAverageTotalsController";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { Functions as TotalsIcon } from "@material-ui/icons"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";

export type AnalyticsAverageTotalsProps = {

};

export function AnalyticsAverageTotals(props: AnalyticsAverageTotalsProps) {

	const controller = useAnalyticsAverageTotalsController(props)

	return <AnalyticsBlock
		header="Monthly average"
		headerIcon={<TotalsIcon />}
	>
		<div className={cx("AnalyticsAverageTotals")}>
			<div className="AnalyticsTotals">
				<div className="header">
					<Type color="gray-600" variant="boldcaps">
						{"Average / Month"}
					</Type>
					<Type color="gray-600" size="md">
						{`(${controller.totals.transactionsAverage.toFixed(1)} transactions)`}
					</Type>
				</div>
				<div className="total">
					<MoneyType
						animate
						amount={controller.totals.average}
						size="xxl"
						colorIfPositive="green-600"
						colorIfNegative="red-600"
					/>
				</div>
				<div className="subtotals">
					<MoneyType
						animate
						amount={controller.totals.incomesAverage}
						size="lg"
						variant="regular"
						colorIfPositive="green-600"
						colorIfNegative="red-600"
					/>
					<Type color="gray-800" size="md">{"/"}</Type>
					<MoneyType
						animate
						amount={controller.totals.expensesAverage}
						size="lg"
						variant="regular"
						colorIfPositive="green-600"
						colorIfNegative="red-600"
					/>
				</div>
			</div >
		</div>
	</AnalyticsBlock>
}