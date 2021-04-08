import "./AnalyticsOverview.scss";
import React from "react";
import cx from "classnames";
import { useAnalyticsOverviewController } from "./useAnalyticsOverviewController";
import { TitleHighlightColumn } from "../../../components/TitleHighlightColumn/TitleHighlightColumn";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { PiechartCircle } from "../../../components/PiechartCircle/PiechartCircle";
import { ChangeIcon } from "../../../components/ChangeIcon/ChangeIcon";

export type AnalyticsOverviewProps = {

};

export function AnalyticsOverview(props: AnalyticsOverviewProps) {

	const controller = useAnalyticsOverviewController(props)

	return <div className={cx("AnalyticsOverview")}>

		<header>
			<TitleHighlightColumn color="primary-500" />
			<Type variant="boldcaps" size="md" color="gray-800">
				{"Overview"}
			</Type>
		</header>

		<section className="total">

			<Type className="label" variant="boldcaps" color="gray-700" size="sm">
				{"Total savings"}
			</Type>

			<MoneyType
				className="total"
				amount={controller.analytics.selected.total.total}
				color="gray-800"
				size="xl"
			/>

			{
				!controller.isAll &&
				<div className="change">
					<ChangeIcon
						change={controller.totalPercentageIncrease}
						color={{
							negative: "red-600",
							positive: "green-600",
							neutral: "gray-600"
						}}
					/>
					<Type
						component="span"
						variant="bold"
						color={
							!controller.totalPercentageIncrease
								? "gray-600"
								: controller.totalPercentageIncrease > 0
									? "green-600"
									: "red-600"
						}
					>
						{`${controller.totalPercentageIncrease.toFixed(1)} %`}
					</Type>
					<Type component="span" color="gray-600">
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
							amount: Math.abs(controller.analytics.selected.total.incomes),
							label: "Incomes"
						},
						{
							color: "red-500",
							amount: Math.abs(controller.analytics.selected.total.expenses),
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
					amount={controller.analytics.selected.total.incomes}
					color="green-600"
				/>

				{
					!controller.isAll &&
					<div className="change income">
						<ChangeIcon
							change={controller.incomePercentageIncrease}
							color={{
								negative: "red-600",
								positive: "green-600",
								neutral: "gray-600"
							}}
						/>
						<Type
							size="sm"
							component="span"
							variant="bold"
							color={
								!controller.incomePercentageIncrease
									? "gray-600"
									: controller.incomePercentageIncrease > 0
										? "green-600"
										: "red-600"
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
					amount={controller.analytics.selected.total.expenses}
					color="red-600"
				/>

				{
					!controller.isAll &&
					<div className="change expense">
						<ChangeIcon
							change={controller.expensesPercentageIncrease}
							color={{
								negative: "green-600",
								positive: "red-600",
								neutral: "gray-600"
							}}
						/>
						<Type
							size="sm"
							component="span"
							variant="bold"

							color={
								!controller.expensesPercentageIncrease
									? "gray-600"
									: controller.expensesPercentageIncrease > 0
										? "red-600"
										: "green-600"
							}
						>
							{`${controller.expensesPercentageIncrease.toFixed(1)} %`}
						</Type>
					</div>
				}

			</div>

		</section>

	</div>
}