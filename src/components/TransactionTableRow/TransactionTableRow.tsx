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
import { useTransactionTableRowController } from "./useTransactionTableRowController";
import { TransactionForm } from "../TransactionForm/TransactionForm";

export type TransactionTableRowProps = {
	transaction: Transaction;
	getAllTransactionIdsBetween(aid: string, bid: string): string[];
}

export function TransactionTableRow(props: TransactionTableRowProps) {

	const controller = useTransactionTableRowController(props)

	if (controller.isEditing) {
		return <div className={cx("TransactionTableRow editing")}>
			<TransactionForm
				hideTitle
				showCloseButton
				editTransaction={props.transaction}
				onClose={controller.onCloseEditing}
				variant="horizontal"
			/>
		</div>
	}

	return <div
		className={cx("TransactionTableRow default", {
			selected: controller.selected,
			contextMenuSelected: controller.contextMenuSelected,
			isUpcoming: props.transaction.isUpcoming
		})}
		onClick={controller.onClick}
		onContextMenu={controller.onContextMenu}
	>
		<div className="action">
			{
				controller.selected
					? <SelectedIcon
						className="selected"
						onClick={e => {
							e.stopPropagation()
							controller.onDeselect()
						}}
					/>
					: <UnselectedIcon
						className="unselected"
						onClick={(e) => {
							e.stopPropagation()
							controller.onSelect()
						}}
					/>
			}
		</div>
		<div className="category">
			<Type variant="bold" color="gray-800" size="md">
				<span className="categoryIcon">
					{controller.transaction.icon}
				</span>
				{controller.transaction.category.value}
			</Type>
		</div>
		<div className="amount">
			<MoneyType
				amount={controller.transaction.amount}
				variant="bold"
				size="md"
				colorIfPositive="green-600"
				colorIfNegative="red-600"
			/>
		</div>
		<div className="comment">
			<Type color="gray-700" variant="regular" size="md">
				{controller.transaction.comment}
			</Type>
		</div>
		<div className="date">
			<Type color="gray-700" variant="regular" size="md">
				{toDatestring(controller.transaction.date)}
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