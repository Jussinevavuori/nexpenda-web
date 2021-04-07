import "./AnalyticsOverview.scss";
import React from "react";
import cx from "classnames";
import { useAnalyticsOverviewController } from "./useAnalyticsOverviewController";
import { TitleHighlightColumn } from "../../../components/TitleHighlightColumn/TitleHighlightColumn";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { PercentageCircle } from "../../../components/PercentageCircle/PercentageCircle";

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

			<Type className="label">
				{"Total"}
			</Type>

			<MoneyType
				className="total"
				amount={new MoneyAmount(297000)}
				color="gray-800"
				size="xl"
			/>

			<div className="change">
				<ArrowUpward />
				<Type component="span" variant="bold" color="green-600">
					{"7.8 %"}
				</Type>
				<Type component="span" color="gray-600">
					{"vs last month"}
				</Type>
			</div>

			<div className="chart">
				<PercentageCircle percentage={78} />
			</div>

		</section>

		<section className="subtotals">

			<div className="subtotal income">

				<Type className="label income">
					{"Incomes"}
				</Type>

				<MoneyType
					className="amount income"
					amount={new MoneyAmount(522040)}
					color="green-600"
				/>

				<div className="change income">
					<ArrowUpward />
					<Type size="sm" component="span" variant="bold" color="green-600">
						{"2.4 %"}
					</Type>
				</div>

			</div>

			<div className="subtotal expense">

				<Type className="label expense">
					{"Expenses"}
				</Type>

				<MoneyType
					className="amount expense"
					amount={new MoneyAmount(-593205)}
					color="red-600"
				/>

				<div className="change expense">
					<ArrowDownward />
					<Type size="sm" component="span" variant="bold" color="red-600">
						{"-5.1 %"}
					</Type>
				</div>

			</div>

		</section>

	</div>
}