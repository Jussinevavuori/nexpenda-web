import "./AnalyticsOverview.scss";
import React from "react";
import cx from "classnames";
import { useAnalyticsOverviewController } from "./useAnalyticsOverviewController";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { PiechartCircle } from "../../../components/PiechartCircle/PiechartCircle";
import { ChangeIcon } from "../../../components/ChangeIcon/ChangeIcon";
import { TimeseriesSparkLine } from "../../../components/TimeseriesSparkLine/TimeseriesSparkLine";
import { ContainerBlock } from "../../../components/Container/ContainerBlock";
import { useIsDarkTheme } from "../../../hooks/application/useIsThemeMode";

export type AnalyticsOverviewProps = {
	interval?: "allTime" | "selected"
};

export function AnalyticsOverview(props: AnalyticsOverviewProps) {

	const controller = useAnalyticsOverviewController(props)
	const isDarkTheme = useIsDarkTheme()

	return <ContainerBlock
		className={cx("AnalyticsOverview")}
		containerTitle="Overview"
	>

		<div className="content">

			<section className="total">

				<Type
					className="label"
					variant="boldcaps"
					color={isDarkTheme ? "gray-200" : "gray-700"}
					size="sm"
				>
					{"Total savings"}
				</Type>

				<MoneyType
					className="total"
					amount={controller.totalTotal}
					color={isDarkTheme ? "gray-100" : "gray-800"}
					size="xl"
				/>

				{
					!controller.isAll &&
					<div className="change">
						<ChangeIcon
							change={controller.totalPercentageIncrease}
							color={{
								negative: isDarkTheme ? "red-400" : "red-600",
								positive: isDarkTheme ? "green-400" : "green-600",
								neutral: isDarkTheme ? "gray-400" : "gray-600"
							}}
						/>
						<Type
							component="span"
							variant="bold"
							color={
								!controller.totalPercentageIncrease
									? (isDarkTheme ? "gray-400" : "gray-600")
									: controller.totalPercentageIncrease > 0
										? (isDarkTheme ? "green-400" : "green-600")
										: (isDarkTheme ? "red-400" : "red-600")
							}
						>
							{`${controller.totalPercentageIncrease.toFixed(1)} %`}
						</Type>
						<Type component="span" color={isDarkTheme ? "gray-400" : "gray-600"}>
							{`vs last ${controller.intervalLengthLabel}`}
						</Type>
					</div>
				}

				<div className="chart">
					<PiechartCircle
						stroke={6}
						data={[
							{
								color: "green-500",
								amount: Math.abs(controller.incomesTotal),
								label: "Incomes"
							},
							{
								color: "red-500",
								amount: Math.abs(controller.expensesTotal),
								label: "Expenses"
							},
						]}
					/>
				</div>

			</section>

			<section className="subtotals">

				<div className="subtotal income">

					<Type className="label income">
						{"Incomes"}
					</Type>

					<MoneyType
						className="amount income"
						amount={controller.incomesTotal}
						color="green-600"
					/>

					{
						!controller.isAll &&
						<div className="change income">
							<ChangeIcon
								change={controller.incomePercentageIncrease}
								color={{
									negative: isDarkTheme ? "red-400" : "red-600",
									positive: isDarkTheme ? "green-400" : "green-600",
									neutral: isDarkTheme ? "gray-400" : "gray-600"
								}}
							/>
							<Type
								size="sm"
								component="span"
								variant="bold"
								color={
									!controller.incomePercentageIncrease
										? (isDarkTheme ? "gray-400" : "gray-600")
										: controller.incomePercentageIncrease > 0
											? (isDarkTheme ? "green-400" : "green-600")
											: (isDarkTheme ? "red-400" : "red-600")
								}
							>
								{`${controller.incomePercentageIncrease.toFixed(1)} %`}
							</Type>
						</div>
					}

				</div>

				<div className="subtotal expense">

					<Type className="label expense">
						{"Expenses"}
					</Type>

					<MoneyType
						className="amount expense"
						amount={controller.expensesTotal}
						color="red-600"
					/>

					{
						!controller.isAll &&
						<div className="change expense">
							<ChangeIcon
								change={controller.expensesPercentageIncrease}
								color={{
									negative: (isDarkTheme ? "green-400" : "green-600"),
									positive: (isDarkTheme ? "red-400" : "red-600"),
									neutral: (isDarkTheme ? "gray-400" : "gray-600")
								}}
							/>
							<Type
								size="sm"
								component="span"
								variant="bold"

								color={
									!controller.expensesPercentageIncrease
										? (isDarkTheme ? "gray-400" : "gray-600")
										: controller.expensesPercentageIncrease > 0
											? (isDarkTheme ? "red-400" : "red-600")
											: (isDarkTheme ? "green-400" : "green-600")
								}
							>
								{`${controller.expensesPercentageIncrease.toFixed(1)} %`}
							</Type>
						</div>
					}

				</div>

			</section>

			<section className="sparkLineSection">
				<div className="sparkLineContainer">
					<TimeseriesSparkLine
						aspectRatio={100 / 23}
						verticalPadding={5}
						showZeroLine
						{...controller.timeseriesSparklineProps}
						cumulative
					/>
				</div>
			</section>
		</div>
	</ContainerBlock >
}