import "./QuickAnalytics.scss";
import React from "react"
import { MoneyAmount } from "../../classes/MoneyAmount";
import { MoneyType } from "../MoneyType/MoneyType";
import { KeyboardArrowUp as IncomeIcon, KeyboardArrowDown as ExpenseIcon } from "@material-ui/icons"

export type QuickAnalyticsViewProps = {
	totalAll: MoneyAmount;
	totalIncomesOnly: MoneyAmount;
	totalExpensesOnly: MoneyAmount;
}

export function QuickAnalyticsView(props: QuickAnalyticsViewProps) {
	return <div className="QuickAnalytics">

		<div className="totalAll">
			<MoneyType
				variant="h3"
				component="p"
				bold
				amount={props.totalAll}
			/>
		</div>

		<div className="subTotals">
			<div className="subTotal">
				<IncomeIcon />
				<MoneyType
					amount={props.totalIncomesOnly}
				/>
			</div>
			<div className="subTotal">
				<ExpenseIcon />
				<MoneyType
					amount={props.totalExpensesOnly}
				/>
			</div>
		</div>

	</div>
}