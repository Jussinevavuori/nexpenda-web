import "./TransactionTableRow.scss";
import React from "react"
import cx from "classnames"
import { Transaction } from "../../lib/DataModels/Transaction";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import {
	CheckBox as SelectedIcon,
	CheckBoxOutlineBlank as UnselectedIcon,
} from "@material-ui/icons"
import { useTransactionTableRowController } from "./useTransactionTableRowController";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import { formatDateString } from "../../lib/Dates/formatDateString";

export type TransactionTableRowProps = {
	transaction: Transaction;
	getAllTransactionIdsBetween(aid: string, bid: string): string[];
}

export function TransactionTableRow(props: TransactionTableRowProps) {

	const controller = useTransactionTableRowController(props)
	const isDarkTheme = useIsDarkTheme()

	if (controller.isEditing) {
		return <div className={cx("TransactionTableRow editing")}>
			<div className="transactionFormContainer">
				<TransactionForm
					hideTitle
					showCloseButton
					editTransaction={props.transaction}
					onClose={controller.onCloseEditing}
					variant="horizontal"
				/>
			</div>
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
			<Type
				variant="bold"
				color={isDarkTheme ? "gray-400" : "gray-800"}
				size="md"
			>
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
				colorIfPositive={isDarkTheme ? "green-500" : "green-600"}
				colorIfNegative={isDarkTheme ? "red-500" : "red-600"}
			/>
		</div>
		<div className="comment">
			<Type
				color={isDarkTheme ? "gray-500" : "gray-700"}
				variant="regular"
				size="md"
			>
				{
					controller.transaction.isUpcoming &&
					<span className="upcomingTag">
						{"Upcoming"}
					</span>
				}
				{controller.transaction.comment}
			</Type>
		</div>
		<div className="date">
			<Type
				color={isDarkTheme ? "gray-400" : "gray-700"}
				variant="regular"
				size="md"
			>
				{formatDateString(controller.transaction.date)}
			</Type>
		</div>
	</div>
}