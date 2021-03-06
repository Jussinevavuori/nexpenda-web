import "./BudgetsOverview.scss";
import React from "react";
import cx from "classnames";
import { useBudgetsOverviewController } from "./useBudgetsOverviewController";
import { PercentageCircle } from "../PercentageCircle/PercentageCircle";
import { Type } from "../Type/Type";
import { MoneyType } from "../MoneyType/MoneyType";
import { Button } from "@material-ui/core";
import { ContainerBlock } from "../Container/ContainerBlock";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type BudgetsOverviewProps = {
	variant?: "narrow" | "default";
};

export function BudgetsOverview(props: BudgetsOverviewProps) {

	const controller = useBudgetsOverviewController(props)
	const isDarkTheme = useIsDarkTheme()

	return <ContainerBlock
		containerTitle="Budgets overview"
		className={cx(
			"BudgetsOverview",
			`variant-${props.variant ?? "default"}`
		)}
	>

		<div
			className={cx(
				"content",
				`variant-${props.variant ?? "default"}`
			)}
		>

			<div className="percentage">
				<PercentageCircle
					size={52 * 2}
					className="percentage"
					percentage={controller.total.percentage}
					backgroundColor={controller.total.percentage > 100 ? (isDarkTheme ? "green-800" : "green-200") : undefined}
					filledColor={controller.total.percentage > 100 ? "green-500" : undefined}
					labelProps={{ size: "lg" }}
				/>
			</div>

			<div className="progress">

				<Type color={isDarkTheme ? "gray-400" : "gray-600"}>
					{`Budget left`}
				</Type>
				<MoneyType
					colorIfPositive={isDarkTheme ? "green-400" : "green-600"}
					colorIfNegative={isDarkTheme ? "red-400" : "red-600"}
					size="lg"
					amount={controller.total.progress}
				/>

			</div>

			<div className="estimate">

				<Type color={isDarkTheme ? "gray-400" : "gray-600"}>
					{`Estimate`}
				</Type>
				<MoneyType
					colorIfPositive={isDarkTheme ? "green-400" : "green-600"}
					colorIfNegative={isDarkTheme ? "red-400" : "red-600"}
					size="lg"
					variant="regular"
					amount={controller.total.estimate}
				/>

			</div>
			<div className="subtotal incomes">
				<Type color={isDarkTheme ? "gray-400" : "gray-600"}>
					{"Incomes"}
				</Type>
				<p className="value">
					<MoneyType
						component="span"
						color={
							controller.income.percentage >= 100
								? (isDarkTheme ? "green-500" : "green-600")
								: (isDarkTheme ? "gray-400" : "gray-800")
						}
						variant="bold"
						amount={controller.income.progress}
					/>
					<Type
						component="span"
						color={isDarkTheme ? "gray-400" : "gray-600"}
					>
						{" / "}
					</Type>
					<MoneyType
						component="span"
						color={isDarkTheme ? "gray-400" : "gray-600"}
						variant="regular"
						amount={controller.income.estimate}
					/>
				</p>
				<PercentageCircle
					className="percentage"
					percentage={controller.income.percentage}
					backgroundColor={controller.income.percentage > 100 ? (isDarkTheme ? "green-800" : "green-200") : undefined}
					filledColor={controller.income.percentage > 100 ? "green-500" : undefined}
				/>
			</div>

			<div className="subtotal expenses">
				<Type color={isDarkTheme ? "gray-400" : "gray-600"}>
					{"Expenses"}
				</Type>
				<p className="value">
					<MoneyType
						component="span"
						color={
							controller.expense.percentage >= 100
								? (isDarkTheme ? "red-500" : "red-600")
								: (isDarkTheme ? "gray-400" : "gray-800")
						}
						variant="bold"
						amount={controller.expense.progress}
					/>
					<Type
						component="span"
						color={isDarkTheme ? "gray-400" : "gray-600"}
					>
						{" / "}
					</Type>
					<MoneyType
						component="span"
						color={isDarkTheme ? "gray-400" : "gray-600"}
						variant="regular"
						amount={controller.expense.estimate}
					/>
				</p>
				<PercentageCircle
					className="percentage"
					percentage={controller.expense.percentage}
					backgroundColor={controller.expense.percentage > 100 ? (isDarkTheme ? "red-900" : "red-200") : undefined}
					filledColor={controller.expense.percentage > 100 ? "red-500" : undefined}
				/>
			</div>
		</div>


		{
			controller.suggestCreateBudgets &&
			<footer>
				<Type variant="bold">
					{"You don't have any budgets yet."}
				</Type>

				<Type size="sm">
					{"Go to the budgets tab and set up your "}
					{"first budgets to start automatic budgets tracking."}
				</Type>

				<Button
					variant="contained"
					color="primary"
					onClick={controller.handleOpenBudgets}
				>
					{"Open budgets"}
				</Button>
			</footer>
		}

	</ContainerBlock >
}