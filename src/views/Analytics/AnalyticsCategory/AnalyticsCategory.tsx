import "./AnalyticsCategory.scss";
import React from "react";
import { createClassnames } from "../../../lib/Utilities/createClassnames";
import { motion } from "framer-motion";
import { Category } from "../../../lib/DataModels/Category";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { useIsDarkTheme } from "../../../hooks/application/useIsThemeMode";

export type AnalyticsCategoryProps = {
	variant: "income" | "expense";
	show?: "percentage" | "value";
	category: Category;
	count: number;
	total: number;
	percentageOfMax: number;
	percentageOfTotal: number;
};

export function AnalyticsCategory(props: AnalyticsCategoryProps) {
	const isDarkTheme = useIsDarkTheme()
	const cx = createClassnames(props.variant)

	return <motion.li layout className={cx("AnalyticsCategory")}>
		<span className="category">
			<span className="icon">
				{
					props.category?.icon
					|| (props.variant === "income" ? "💰" : "💸")
				}
			</span>
			<Type
				component="span"
				className="name"
				color={props.variant === "income"
					? isDarkTheme ? "green-400" : "green-800"
					: isDarkTheme ? "red-400" : "red-800"}
				variant="bold"
			>
				{props.category?.value || ""}
			</Type>
			<Type
				size="sm"
				component="span"
				className="count"
				color={isDarkTheme ? "gray-700" : "gray-600"}
				variant="bold"
			>
				{"x"}{props.count}
			</Type>
		</span>
		{
			props.show === "percentage"
				? <Type
					className="amount"
					color={props.variant === "income" ? "green-600" : "red-600"}
					variant="bold"
				>
					{props.percentageOfTotal.toFixed(1) + " %"}
				</Type>
				: <MoneyType
					animate
					className="amount"
					colorIfPositive={isDarkTheme ? "green-500" : "green-600"}
					colorIfNegative={isDarkTheme ? "red-500" : "red-600"}
					amount={props.total}
				/>
		}
		<motion.div
			layoutId={`${props.variant}-${props.category.id}`}
			className="bars"
		>
			<motion.div
				layoutId={`${props.variant}-${props.category.id}-background-bar`}
				className={cx("backgroundBar")}
				animate={{ visibility: "visible" }}
			/>
			<motion.div
				layoutId={`${props.variant}-${props.category.id}-active-bar`}
				className={cx("activeBar")}
				animate={{ width: `${props.percentageOfMax}%`, visibility: "visible" }}
			/>
		</motion.div>
	</motion.li>
}