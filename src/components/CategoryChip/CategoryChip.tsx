import "./CategoryChip.scss";
import React from "react";
import cx from "classnames";
import { Category } from "../../classes/Category";
import { Type, TypeProps } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type CategoryChipProps = {
	category: Category;
	TypeProps?: TypeProps;
	defaultIcon?: "expense" | "income";
};

export function CategoryChip(props: CategoryChipProps) {
	const isDarkTheme = useIsDarkTheme()

	return <Type
		component="span"
		size="sm"
		variant="bold"
		color={isDarkTheme ? "primary-400" : "primary-700"}
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