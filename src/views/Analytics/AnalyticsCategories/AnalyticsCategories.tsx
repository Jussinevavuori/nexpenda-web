import "./AnalyticsCategories.scss";
import React from "react"
import { useAnalyticsCategoriesController } from "./useAnalyticsCategoriesController"
import { AnalyticsBlock } from "../AnalyticsBlock/AnalyticsBlock";
import { Type } from "../../../components/Type/Type";
import { AnimateSharedLayout, motion } from "framer-motion"
import { AnalyticsCategory } from "../AnalyticsCategory/AnalyticsCategory";

export type AnalyticsCategoriesProps = {
}

export function AnalyticsCategories(props: AnalyticsCategoriesProps) {

	const controller = useAnalyticsCategoriesController(props)

	return <AnalyticsBlock
		header="Categories"
	// headerContent={<div className="AnalyticsCategories__headerContent">
	// 	<ButtonGroup size="small">
	// 		<Button
	// 			color="primary"
	// 			size="small"
	// 			variant={controller.isShowingValues ? "contained" : "outlined"}
	// 			onClick={controller.showValues}
	// 		>
	// 			{"€"}
	// 		</Button>
	// 		<Button
	// 			color="primary"
	// 			size="small"
	// 			variant={controller.isShowingPercentages ? "contained" : "outlined"}
	// 			onClick={controller.showPercentages}
	// 		>
	// 			{"%"}
	// 		</Button>
	// 	</ButtonGroup>
	// </div>}
	>
		<div className="AnalyticsCategories">
			<AnimateSharedLayout>
				<motion.div layout className="incomes">
					<Type color="gray-600" variant="boldcaps">
						{"Incomes"}
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
										total={category.total}
										count={category.transactions}
										percentageOfMax={category.percentageOfMax}
										percentageOfTotal={category.percentageOfTotal}
										key={category.category.id}
									/>
								))
						}
					</ul>
				</motion.div>
				<motion.div layout className="expenses">
					<Type color="gray-600" variant="boldcaps">
						{"Expenses"}
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
										total={category.total}
										count={category.transactions}
										percentageOfMax={category.percentageOfMax}
										percentageOfTotal={category.percentageOfTotal}
										key={category.id}
									/>
								))
						}
					</ul>
				</motion.div>
			</AnimateSharedLayout>
		</div>
	</AnalyticsBlock>

}