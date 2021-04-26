import "./DashboardOverview.scss";
import React from "react"
import { Type } from "../../../components/Type/Type";
import { ExpandLess as IncomesIcon, ExpandMore as ExpensesIcon } from "@material-ui/icons";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { useDashboardOverviewController } from "./useDashboardOverviewController";

export type DashboardOverviewProps = {
}

export function DashboardOverview(props: DashboardOverviewProps) {

	const controller = useDashboardOverviewController(props)

	return <div className="DashboardOverview">

		<div className="left">
			<div className="title">
				<Type component="h1" size="xl" color="gray-900" variant="bold">
					{"Your transactions"}
				</Type>
			</div>
			<div className="transactions-count">
				<Type size="md" color="gray-600" variant="boldcaps">
					{
						controller.isSelectionActive
							? `Selected ${controller.selectionLength} / ${controller.transactionsCount} transactions`
							: `${controller.transactionsCount} transactions`
					}
				</Type>
			</div>
		</div>

		<div className="right">
			<div className="total">
				<MoneyType
					animate
					colorIfPositive="green-600"
					colorIfNegative="red-600"
					amount={controller.transactionsTotal}
					size="xl"
					variant="bold"
				/>
			</div>
			<div className="subtotals">
				<div>
					<IncomesIcon />
					<MoneyType
						animate
						color="gray-700"
						amount={controller.transactionsTotalIncome}
						size="md"
						variant="regular"
					/>
				</div>
				<div>
					<ExpensesIcon />
					<MoneyType
						animate
						color="gray-700"
						amount={controller.transactionsTotalExpense}
						size="md"
						variant="regular"
					/>
				</div>
			</div>
		</div>

	</div>
}