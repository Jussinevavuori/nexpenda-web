import "./AnalyticsCategories.scss";
import React from "react"
import { useAnalyticsCategoriesController } from "./useAnalyticsCategoriesController"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { Category as CategoriesIcon } from "@material-ui/icons"
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { AnimateSharedLayout, motion } from "framer-motion"
import { Timerange } from "../../../utils/AnalyticsUtils/Timerange";

export type AnalyticsCategoriesProps = {
	wrapInAnalyticsBlock?: boolean;
}

type SubComponentProps = {
	timeranges: Timerange[];
	variant: "expense" | "income";
}

function SubComponent(props: SubComponentProps) {
	return <div className={props.variant}>
		<motion.div layout>
			<Type color="gray-600" variant="boldcaps">
				{props.variant === "income" ? "Incomes" : "Expenses"}
			</Type>
		</motion.div>

		<AnimateSharedLayout>
			<ul className={props.variant}>
				{
					props.timeranges.length === 0
						? <div className="empty">
							<Type color="gray-600">
								{`No ${props.variant}s available`}
							</Type>
						</div>
						: props.timeranges.map((timerange, i) => {
							return <motion.li layout key={i}>
								<Type className="category" color="green-800" variant="bold">
									{timerange.total.category?.value || ""}
								</Type>
								<Type className="count" color="gray-600" variant="bold">
									{
										props.variant === "income"
											? timerange.total.incomesCount
											: timerange.total.expensesCount
									}
								</Type>
								<MoneyType
									animate
									className="amount"
									colorIfPositive="green-600"
									colorIfNegative="red-600"
									amount={
										props.variant === "income"
											? timerange.total.incomes
											: timerange.total.expenses
									}
								/>
								<Type className="percentage" color="gray-600" variant="bold">
									{
										(props.variant === "income"
											? timerange.total.percentage.incomes.ofTotal.toFixed(1)
											: timerange.total.percentage.expenses.ofTotal.toFixed(1))
										+ " %"
									}
								</Type>
								<motion.div layoutId={`${props.variant}-${i}`} className="bars">
									<motion.div
										layoutId={`${props.variant}-${i}-background-bar`}
										className="backgroundBar"
									/>
									<motion.div
										layoutId={`${props.variant}-${i}-active-bar`}
										className={`activeBar ${props.variant}`}
										style={
											{
												width: `${props.variant === "income"
													? timerange.total.percentage.incomes.ofMax
													: timerange.total.percentage.expenses.ofMax
													}%`
											}
										}
									/>
								</motion.div>
							</motion.li>
						})
				}
			</ul>
		</AnimateSharedLayout>
	</div>
}

export function AnalyticsCategories(props: AnalyticsCategoriesProps) {

	const controller = useAnalyticsCategoriesController(props)

	const content = <div className="AnalyticsCategories">
		<SubComponent timeranges={controller.incomesCategories} variant="income" />
		<SubComponent timeranges={controller.expensesCategories} variant="expense" />
	</div>

	if (props.wrapInAnalyticsBlock) {
		return <AnalyticsBlock
			header="Categories"
			headerIcon={<CategoriesIcon />}
			children={content}
		/>
	} else {
		return content
	}
}