import "./BudgetBlock.scss";
import React from "react";
import cx from "classnames";
import { useBudgetBlockController } from "./useBudgetBlockController";
import { Budget } from "../../lib/DataModels/Budget";
import { PercentageCircle } from "../PercentageCircle/PercentageCircle";
import { CategoryChip } from "../CategoryChip/CategoryChip";
import { Type } from "../Type/Type";
import { IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { BudgetBlockMenu } from "../BudgetBlockMenu/BudgetBlockMenu";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type BudgetBlockProps = {
	budget: Budget
};

export function BudgetBlock(props: BudgetBlockProps) {

	const controller = useBudgetBlockController(props)
	const isDarkTheme = useIsDarkTheme()

	return <>

		<BudgetBlockMenu
			budget={props.budget}
			MenuProps={{ anchorEl: controller.menu.anchorEl }}
		/>

		<div className={cx("BudgetBlock")}>

			<div className={cx("percentage")}>
				<PercentageCircle
					percentage={controller.percentage}
					backgroundColor={
						props.budget.type === "expense"
							? controller.percentage > 100 ? (isDarkTheme ? "red-900" : "red-200") : undefined
							: controller.percentage > 100 ? (isDarkTheme ? "green-800" : "green-200") : undefined
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
					<Type component="span" color={isDarkTheme ? "gray-300" : "gray-700"}>
						{controller.progress.formatAbsValue()}
					</Type>
					<Type component="span" color={isDarkTheme ? "gray-300" : "gray-700"}>
						{" / "}
					</Type>
					<Type component="span" color={isDarkTheme ? "gray-300" : "gray-700"}>
						{controller.budgetAmount.formatAbsValue()}
					</Type>
					{
						controller.isAveraged && controller.budget &&
						<Type
							component="span"
							size="sm"
							color={isDarkTheme ? "gray-500" : "gray-600"}
							className="average"
						>
							{`Average of ${controller.budget.periodMonths} previous months`}
						</Type>
					}

				</div>
			</div>
			<div className={cx("categories")}>
				{
					controller.budgetCategories.map(category => (
						<CategoryChip category={category} key={category.id} />
					))
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