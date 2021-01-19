import "./TransactionTableHeader.scss";
import React from "react"
import { Type } from "../Type/Type";
import {
	CheckBox as AllSelectedIcon,
	CheckBoxOutlineBlank as NoneSelectedIcon,
	IndeterminateCheckBox as SomeSelectedIcon,
	ExpandLess as AscendingSortIcon,
	ExpandMore as DescendingSortIcon,
} from "@material-ui/icons";
import { useTransactionTableHeaderController } from "./useTransactionTableHeaderController";

export type TransactionTableHeaderProps = {
}

export function TransactionTableHeader(props: TransactionTableHeaderProps) {

	const controller = useTransactionTableHeaderController(props)

	return <div className="TransactionTableHeader">
		<div className="action">
			{
				controller.isSelectionActive
					? controller.isAllSelected
						? <AllSelectedIcon
							className="checkbox allselected"
							onClick={controller.onDeselectAll}
						/>
						: <SomeSelectedIcon
							className="checkbox someselected"
							onClick={controller.onSelectAll}
						/>
					: <NoneSelectedIcon
						className="checkbox noneselected"
						onClick={controller.onSelectAll}
					/>
			}
		</div>
		<div
			className="category"
			onClick={() => controller.onToggleSort("category")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Category"}
			</Type>
			{
				controller.sortingStrategy === "category-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: controller.sortingStrategy === "category-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
		<div
			className="amount"
			onClick={() => controller.onToggleSort("amount")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Amount"}
			</Type>
			{
				controller.sortingStrategy === "amount-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: controller.sortingStrategy === "amount-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
		<div
			className="comment"
			onClick={() => controller.onToggleSort("comment")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Comment"}
			</Type>
			{
				controller.sortingStrategy === "comment-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: controller.sortingStrategy === "comment-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
		<div
			className="date"
			onClick={() => controller.onToggleSort("date")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Date"}
			</Type>
			{
				controller.sortingStrategy === "date-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: controller.sortingStrategy === "date-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
	</div>
}