import "./TransactionTableRow.scss";
import React from "react"
import { Transaction } from "../../classes/Transaction";
import { format } from "date-fns";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import { Button, IconButton } from "@material-ui/core";
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Label as LabelIcon
} from "@material-ui/icons"
import { HslColor } from "../../utils/ColorUtils/Color";

export type TransactionTableRowViewProps = {
	transaction: Transaction;
	deleting?: boolean;
	onDelete(): void;
	onCancelDelete(): void;
}

export function TransactionTableRowView(props: TransactionTableRowViewProps) {

	/**
	 * Generate a random color to use as the label color for the category.
	 */
	const color = HslColor.getRandomColorFromString(
		props.transaction.category,
		{
			lightness: 48,
			saturation: 58,
		}
	)

	/**
	 * When deleting (delete button clicked and waiting to commit),
	 * show message and enable user to cancel deletion.
	 */
	if (props.deleting) {
		return <div className="TransactionTableRow deleting">
			<Type color="error">
				{"Deleted transaction."}
			</Type>
			<Button
				size="small"
				onClick={props.onCancelDelete}
			>
				{"Cancel"}
			</Button>
		</div>
	}

	return <div className="TransactionTableRow">
		<div className="category">
			<IconButton size="small">
				<LabelIcon style={{ color: color.toHexString() }} />
			</IconButton>
			<Type variant="subtitle2">
				{props.transaction.category}
			</Type>
		</div>
		<div className="amount">
			<MoneyType
				amount={props.transaction.amount}
				applyColor
				bold
			/>
		</div>
		<div className="comment">
			<Type variant="body2">
				{props.transaction.comment}
			</Type>
		</div>
		<div className="date">
			<Type variant="subtitle2">
				{toDatestring(props.transaction.date)}
			</Type>
		</div>
		<div className="actions">
			<IconButton className="primary-action" size="small">
				<EditIcon />
			</IconButton>
			<IconButton
				onClick={props.onDelete}
				className="delete-action"
				size="small"
			>
				<DeleteIcon />
			</IconButton>
		</div>
	</div>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "d.M.")
		: format(date, "d.M.yyyy")
}

const currentYear = new Date().getFullYear()