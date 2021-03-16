import "./CategoryChip.scss";
import React from "react";
import cx from "classnames";
// import { useCategoryChipController } from "./useCategoryChipController";
import { Category } from "../../classes/Category";
import { Type, TypeProps } from "../Type/Type";

export type CategoryChipProps = {
	category: Category;
	TypeProps?: TypeProps;
	defaultIcon?: "expense" | "income";
};

export function CategoryChip(props: CategoryChipProps) {

	// const controller = useCategoryChipController(props)

	return <Type
		component="span"
		size="sm"
		variant="bold"
		color="primary-700"
		{...{
			...props.TypeProps,
			className: cx("CategoryChip")
		}}
	>
		<span className={cx("icon")}>
			{
				props.category.icon || (
					props.defaultIcon === "expense"
						? Category.defaultExpenseIcon
						: Category.defaultIncomeIcon
				)
			}
		</span>

		<span className={cx("icon")}>
			{props.category.name}
		</span>

	</Type>
}