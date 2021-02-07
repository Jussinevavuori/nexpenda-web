import "./AnalyticsCategory.scss";
import React from "react";
import { useAnalyticsCategoryController } from "./useAnalyticsCategoryController";
import { createClassnames } from "../../../utils/Utils/createClassnames";
import { motion } from "framer-motion";
import { Category } from "../../../classes/Category";
import { Type } from "../../../components/Type/Type";
import { MoneyType } from "../../../components/MoneyType/MoneyType";

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
	useAnalyticsCategoryController(props)

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
				color="green-800"
				variant="bold"
			>
				{props.category?.value || ""}
			</Type>
			<Type
				size="sm"
				component="span"
				className="count"
				color="gray-600"
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
					colorIfPositive="green-600"
					colorIfNegative="red-600"
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