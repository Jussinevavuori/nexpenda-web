import "./AnalyticsAllTimeOverview.scss";
import React from "react";
import cx from "classnames";
import { useAnalyticsAllTimeOverviewController } from "./useAnalyticsAllTimeOverviewController";
import { Type } from "../Type/Type";
import { MoneyType } from "../MoneyType/MoneyType";
import { PiechartCircle } from "../PiechartCircle/PiechartCircle";
import { TimeseriesSparkLine } from "../TimeseriesSparkLine/TimeseriesSparkLine";
import { ContainerBlock } from "../Container/ContainerBlock";

export type AnalyticsAllTimeOverviewProps = {

};

export function AnalyticsAllTimeOverview(props: AnalyticsAllTimeOverviewProps) {

	const controller = useAnalyticsAllTimeOverviewController(props)

	return <ContainerBlock
		className={cx("AnalyticsAllTimeOverview")}
		containerTitle="All time overview"
	>
		<div className="content">

			<section className="total">

				<Type className="label" variant="boldcaps" color="gray-700" size="sm">
					{"Total savings"}
				</Type>

				<MoneyType
					className="total"
					amount={controller.analytics.allTime.total.total}
					color="gray-800"
					size="xl"
				/>

				<div className="chart">
					<PiechartCircle
						stroke={6}
						data={[
							{
								color: "green-500",
								amount: Math.abs(controller.analytics.allTime.total.incomes),
								label: "Incomes"
							},
							{
								color: "red-500",
								amount: Math.abs(controller.analytics.allTime.total.expenses),
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
						amount={controller.analytics.allTime.total.incomes}
						color="green-600"
					/>

				</div>

				<div className="subtotal expense">

					<Type className="label expense">
						{"Expenses"}
					</Type>

					<MoneyType
						className="amount expense"
						amount={controller.analytics.allTime.total.expenses}
						color="red-600"
					/>

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
	</ContainerBlock>
}