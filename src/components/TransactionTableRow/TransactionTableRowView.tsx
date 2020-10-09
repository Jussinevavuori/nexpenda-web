import "./TransactionTableRow.scss";
import React from "react"
import { Transaction } from "../../classes/Transaction";
import { format } from "date-fns";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import { IconButton } from "@material-ui/core";
import {
	Edit as EditIcon,
	Delete as DeleteIcon
} from "@material-ui/icons"

export type TransactionTableRowViewProps = {
	transaction: Transaction;
}

export function TransactionTableRowView(props: TransactionTableRowViewProps) {
	return <div className="TransactionTableRow">
		<div className="amount">
			<MoneyType
				amount={props.transaction.amount}
				applyColor
				bold
			/>
		</div>
		<div className="category">
			<Type>
				{props.transaction.category}
			</Type>
		</div>
		<div className="comment">
			<Type>
				{props.transaction.comment}
			</Type>
		</div>
		<div className="date">
			<Type>
				{toDatestring(props.transaction.date)}
			</Type>
		</div>
		<div className="actions">
			<IconButton className="primary-action" size="small">
				<EditIcon />
			</IconButton>
			<IconButton className="delete-action" size="small">
				<DeleteIcon />
			</IconButton>
		</div>
	</div>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "dd.MM.")
		: format(date, "dd.MM.yyyy")
}

const currentYear = new Date().getFullYear()