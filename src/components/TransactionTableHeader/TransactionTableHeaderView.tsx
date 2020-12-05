import "./TransactionTableHeader.scss";
import React from "react"
import { Type } from "../Type/Type";
import { CheckBox, CheckBoxOutlineBlank, IndeterminateCheckBox } from "@material-ui/icons";

export type TransactionTableHeaderViewProps = {
	isSelectionActive: boolean;
	isAllSelected: boolean;
	onSelectAll(): void;
	onDeselectAll(): void;
}

export function TransactionTableHeaderView(props: TransactionTableHeaderViewProps) {
	return <div className="TransactionTableHeader">
		<div className="action">
			{
				props.isSelectionActive
					? props.isAllSelected
						? <CheckBox
							className="checkbox allselected"
							onClick={props.onDeselectAll}
						/>
						: <IndeterminateCheckBox
							className="checkbox someselected"
							onClick={props.onSelectAll}
						/>
					: <CheckBoxOutlineBlank
						className="checkbox noneselected"
						onClick={props.onSelectAll}
					/>
			}
		</div>
		<div className="category">
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Category"}
			</Type>
		</div>
		<div className="amount">
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Amount"}
			</Type>
		</div>
		<div className="comment">
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Comment"}
			</Type>
		</div>
		<div className="date">
			<Type variant="boldcaps" size="sm" color="gray-600">
				{"Date"}
			</Type>
		</div>
	</div>
}