import "./AnalyticsMonthlyAverages.scss";
import React from "react"
import { useAnalyticsMonthlyAveragesController } from "./useAnalyticsMonthlyAveragesController"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { DateRange } from "@material-ui/icons";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { Button, ButtonGroup } from "@material-ui/core";

export type AnalyticsMonthlyAveragesProps = {
	wrapInAnalyticsBlock?: boolean;
}

export function AnalyticsMonthlyAverages(props: AnalyticsMonthlyAveragesProps) {

	const controller = useAnalyticsMonthlyAveragesController(props)

	const content = <div className="AnalyticsMonthlyAverages">
		<ul>
			<li>
				<Type color="gray-600" variant="boldcaps">
					{"Average monthly total"}
				</Type>
				<MoneyType
					animate
					amount={controller.activeAverage.total}
					size="xxl"
					colorIfPositive="green-600"
					colorIfNegative="red-600"
				/>
			</li>
			<li>
				<Type color="gray-600" variant="boldcaps">
					{"Average monthly income"}
				</Type>
				<MoneyType
					animate
					amount={controller.activeAverage.income}
					size="lg"
					colorIfPositive="green-600"
					colorIfNegative="red-600"
				/>
			</li>
			<li>
				<Type color="gray-600" variant="boldcaps">
					{"Average monthly spending"}
				</Type>
				<MoneyType
					animate
					amount={controller.activeAverage.expense}
					size="lg"
					colorIfPositive="green-600"
					colorIfNegative="red-600"
				/>
			</li>
		</ul>
		<div className="buttons">
			<ButtonGroup>
				{
					controller.timeranges.map(tr => {
						const isActive = tr.id === controller.activeTimerange.id
						return <Button
							key={tr.id}
							onClick={() => controller.setActiveTimerangeId(tr.id)}
							variant={isActive ? "contained" : "outlined"}
							children={tr.label}
						/>
					})
				}
			</ButtonGroup>
		</div>
	</div>

	if (props.wrapInAnalyticsBlock) {
		return <AnalyticsBlock
			header="Monthly averages"
			headerIcon={<DateRange />}
			children={content}
		/>
	} else {
		return content
	}
}