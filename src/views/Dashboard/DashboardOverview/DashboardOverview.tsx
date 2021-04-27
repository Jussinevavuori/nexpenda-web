import "./DashboardOverview.scss";
import React from "react"
import { Type } from "../../../components/Type/Type";
import { ExpandLess as IncomesIcon, ExpandMore as ExpensesIcon } from "@material-ui/icons";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { useDashboardOverviewController } from "./useDashboardOverviewController";
import { useIsDarkTheme } from "../../../hooks/application/useIsThemeMode";

export type DashboardOverviewProps = {
}

export function DashboardOverview(props: DashboardOverviewProps) {

	const controller = useDashboardOverviewController(props)
	const isDarkTheme = useIsDarkTheme()

	return <div className="DashboardOverview">

		<div className="left">
			<div className="title">
				<Type
					component="h1"
					size="xl"
					color={isDarkTheme ? "gray-100" : "gray-900"}
					variant="bold"
				>
					{"Your transactions"}
				</Type>
			</div>
			<div className="transactions-count">
				<Type
					size="md"
					color={isDarkTheme ? "gray-500" : "gray-600"}
					variant="boldcaps"
				>
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
					colorIfPositive={isDarkTheme ? "green-500" : "green-600"}
					colorIfNegative={isDarkTheme ? "red-500" : "red-600"}
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
						color={isDarkTheme ? "gray-500" : "gray-700"}
						amount={controller.transactionsTotalIncome}
						size="md"
						variant="regular"
					/>
				</div>
				<div>
					<ExpensesIcon />
					<MoneyType
						animate
						color={isDarkTheme ? "gray-500" : "gray-700"}
						amount={controller.transactionsTotalExpense}
						size="md"
						variant="regular"
					/>
				</div>
			</div>
		</div>

	</div>
}