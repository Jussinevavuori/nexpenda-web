import "./BudgetBlock.scss";
import React from "react";
import cx from "classnames";
import { useBudgetBlockController } from "./useBudgetBlockController";
import { Budget } from "../../classes/Budget";
import { PercentageCircle } from "../PercentageCircle/PercentageCircle";
import { CategoryChip } from "../CategoryChip/CategoryChip";
import { Type } from "../Type/Type";
import { IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { BudgetBlockMenu } from "../BudgetBlockMenu/BudgetBlockMenu";

export type BudgetBlockProps = {
	budget: Budget
};

export function BudgetBlock(props: BudgetBlockProps) {

	const controller = useBudgetBlockController(props)

	return <>

		<BudgetBlockMenu
			budget={props.budget}
			open={controller.isMenuOpen}
			onClose={controller.handleMenuClose}
			MenuProps={{
				anchorEl: controller.menuAnchorEl,
			}}
		/>

		<div className={cx("BudgetBlock")}>

			<div className={cx("percentage")}>
				<PercentageCircle
					percentage={controller.percentage}
					backgroundColor={
						props.budget.type === "expense"
							? controller.percentage > 100 ? "red-200" : undefined
							: controller.percentage > 100 ? "green-200" : undefined
					}
					filledColor={
						props.budget.type === "expense"
							? controller.percentage > 100 ? "red-500" : undefined
							: controller.percentage > 100 ? "green-500" : undefined
					}
				/>
			</div>
			<div className={cx("details")}>
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
			<div className={cx("manage")}>
				<IconButton onClick={controller.handleMenuOpen}>
					<MoreVert />
				</IconButton>
			</div>

		</div>
	</>
}