import "./TransactionTableRow.scss";
import React from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import { format } from "date-fns";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import {
	CheckBox as SelectedIcon,
	CheckBoxOutlineBlank as UnselectedIcon,
} from "@material-ui/icons"

export type TransactionTableRowViewProps = {
	transaction: Transaction;

	onSelectCategory(): void;

	onClick(e: React.MouseEvent): void;
	onContextMenu(e: React.MouseEvent<HTMLElement>): void;

	selected: boolean;
	onSelect(): void;
	onDeselect(): void;
	selectionActive: boolean;
}

export function TransactionTableRowView(props: TransactionTableRowViewProps) {

	return <div
		className={cx("TransactionTableRow", { selected: props.selected })}
		onClick={props.onClick}
		onContextMenu={props.onContextMenu}
	>
		<div className="action">
			{
				props.selected
					? <SelectedIcon
						className="selected"
						onClick={e => {
							e.stopPropagation()
							props.onDeselect()
						}}
					/>
					: <UnselectedIcon
						className="unselected"
						onClick={(e) => {
							e.stopPropagation()
							props.onSelect()
						}}
					/>
			}
		</div>
		<div className="category">
			<Type variant="bold" color="gray-800" size="md">
				{props.transaction.category.value}
			</Type>
		</div>
		<div className="amount">
			<MoneyType
				amount={props.transaction.amount}
				variant="bold"
				size="md"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="comment">
			<Type color="gray-700" variant="regular" size="md">
				{props.transaction.comment}
			</Type>
		</div>
		<div className="date">
			<Type color="gray-700" variant="regular" size="md">
				{toDatestring(props.transaction.date)}
			</Type>
		</div>
	</div>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "d.M.")
		: format(date, "d.M.yyyy")
}

const currentYear = new Date().getFullYear()