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

export type TransactionTableHeaderViewProps = {
	isSelectionActive: boolean;
	isAllSelected: boolean;
	onSelectAll(): void;
	onDeselectAll(): void;
	sortingStrategy: TransactionSortStrategy;
	onToggleSort(property: TransactionSortableProperty): void;
}

export function TransactionTableHeaderView(props: TransactionTableHeaderViewProps) {
	return <div className="TransactionTableHeader">
		<div className="action">
			{
				props.isSelectionActive
					? props.isAllSelected
						? <AllSelectedIcon
							className="checkbox allselected"
							onClick={props.onDeselectAll}
						/>
						: <SomeSelectedIcon
							className="checkbox someselected"
							onClick={props.onSelectAll}
						/>
					: <NoneSelectedIcon
						className="checkbox noneselected"
						onClick={props.onSelectAll}
					/>
			}
		</div>
		<div
			className="category"
			onClick={() => props.onToggleSort("category")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Category"}
			</Type>
			{
				props.sortingStrategy === "category-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: props.sortingStrategy === "category-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
		<div
			className="amount"
			onClick={() => props.onToggleSort("amount")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Amount"}
			</Type>
			{
				props.sortingStrategy === "amount-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: props.sortingStrategy === "amount-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
		<div
			className="comment"
			onClick={() => props.onToggleSort("comment")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Comment"}
			</Type>
			{
				props.sortingStrategy === "comment-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: props.sortingStrategy === "comment-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
		<div
			className="date"
			onClick={() => props.onToggleSort("date")}
		>
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Date"}
			</Type>
			{
				props.sortingStrategy === "date-descending"
					? <DescendingSortIcon className="sortbutton descending" />
					: props.sortingStrategy === "date-ascending"
						? <AscendingSortIcon className="sortbutton ascending" />
						: null
			}
		</div>
	</div>
}