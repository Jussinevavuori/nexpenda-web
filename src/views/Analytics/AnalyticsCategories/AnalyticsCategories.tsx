import "./AnalyticsCategories.scss";
import React from "react"
import { CategoryAnalytics, useAnalyticsCategoriesController } from "./useAnalyticsCategoriesController"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { Category as CategoriesIcon } from "@material-ui/icons"
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { AnimateSharedLayout, motion } from "framer-motion"

export type AnalyticsCategoriesProps = {
	wrapInAnalyticsBlock?: boolean;
}

type SubComponentProps = {
	categories: CategoryAnalytics[];
	variant: "expense" | "income"
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
					props.categories.length === 0
						? <div className="empty">
							<Type color="gray-600">
								{`No ${props.variant}s available`}
							</Type>
						</div>
						: props.categories.map((category, i) => {
							return <motion.li layout key={i}>
								<Type className="category" color="green-800" variant="bold">
									{category.category}
								</Type>
								<Type className="count" color="gray-600" variant="bold">
									{category.count}
								</Type>
								<MoneyType
									animate
									className="amount"
									amount={category.amount}
									colorIfPositive="green-600"
									colorIfNegative="red-600"
								/>
								<Type className="percentage" color="gray-600" variant="bold">
									{`${category.percentageOfTotal.toFixed(1)} %`}
								</Type>
								<motion.div layoutId={`${props.variant}-${i}`} className="bars">
									<motion.div
										layoutId={`${props.variant}-${i}-active-bar`}
										className="backgroundBar"
									/>
									<motion.div
										layoutId={`${props.variant}-${i}-background-bar`}
										className={`activeBar ${props.variant}`}
										style={{ width: `${category.percentageOfMax}%` }}
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
		<SubComponent categories={controller.categories.incomes} variant="income" />
		<SubComponent categories={controller.categories.expenses} variant="expense" />
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