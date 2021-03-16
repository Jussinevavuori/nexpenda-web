import "./BudgetBlock.scss";
import React from "react";
import cx from "classnames";
import { useBudgetBlockController } from "./useBudgetBlockController";
import { Budget } from "../../classes/Budget";
import { PercentageCircle } from "../PercentageCircle/PercentageCircle";
import { CategoryChip } from "../CategoryChip/CategoryChip";
import { Type } from "../Type/Type";

export type BudgetBlockProps = {
	budget: Budget
};

export function BudgetBlock(props: BudgetBlockProps) {

	const controller = useBudgetBlockController(props)

	return <div className={cx("BudgetBlock")}>

		<div className={cx("percentage")}>
			<PercentageCircle
				percentage={controller.percentage}
				variant={props.budget.isExpense ? "expense" : "income"}
			/>
		</div>
		<div className={cx("label")}>
			<Type variant="bold" size="sm">
				{controller.budgetLabel}
			</Type>
		</div>
		<div className={cx("amount")}>
			{controller.progress.formatAbsValue()}
			{" / "}
			{props.budget.amount.formatAbsValue()}
		</div>
		<div className={cx("categories")}>
			{
				controller.budgetCategories.map(category => {
					return <CategoryChip
						category={category}
						key={category.id}
					/>
				})
			}
		</div>

	</div>
}