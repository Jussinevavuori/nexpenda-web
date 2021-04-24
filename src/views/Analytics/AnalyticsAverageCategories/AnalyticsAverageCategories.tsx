import "./AnalyticsAverageCategories.scss";
import React from "react";
import { useAnalyticsAverageCategoriesController } from "./useAnalyticsAverageCategoriesController";
import { Type } from "../../../components/Type/Type";
import { AnimateSharedLayout, motion } from "framer-motion"
import { AnalyticsCategory } from "../AnalyticsCategory/AnalyticsCategory";
import { ContainerBlock } from "../../../components/Container/ContainerBlock"

export type AnalyticsAverageCategoriesProps = {
	showOnly?: "incomes" | "expenses";
};

export function AnalyticsAverageCategories(props: AnalyticsAverageCategoriesProps) {

	const controller = useAnalyticsAverageCategoriesController(props)

	return <ContainerBlock containerTitle="Category averages">
		<div className="AnalyticsAverageCategories">
			<AnimateSharedLayout>
				{
					props.showOnly === "expenses" ? null :
						< motion.div layout className="incomes">
							<Type color="gray-600" variant="boldcaps">
								{"Average incomes / month"}
							</Type>
							<ul>
								{
									controller.hasNoIncomes
										? <div className="empty">
											<Type color="gray-600">
												{`No incomes available`}
											</Type>
										</div>
										: controller.incomes.map((category, i) => (
											<AnalyticsCategory
												variant="income"
												show={controller.isShowingPercentages ? "percentage" : "value"}
												category={category.category}
												total={category.average}
												count={category.transactions}
												percentageOfMax={category.percentageOfMax}
												percentageOfTotal={category.percentageOfTotal}
												key={category.category.id}
											/>
										))
								}
							</ul>
						</motion.div>
				}
				{
					props.showOnly === "incomes" ? null :
						<motion.div layout className="expenses">
							<Type color="gray-600" variant="boldcaps">
								{"Average expenses / month"}
							</Type>
							<ul>
								{
									controller.hasNoExpenses
										? <div className="empty">
											<Type color="gray-600">
												{`No expenses available`}
											</Type>
										</div>
										: controller.expenses.map((category, i) => (
											<AnalyticsCategory
												variant="expense"
												show={controller.isShowingPercentages ? "percentage" : "value"}
												category={category.category}
												total={category.average}
												count={category.transactions}
												percentageOfMax={category.percentageOfMax}
												percentageOfTotal={category.percentageOfTotal}
												key={category.id}
											/>
										))
								}
							</ul>
						</motion.div>
				}
			</AnimateSharedLayout>
		</div>
	</ContainerBlock >
}