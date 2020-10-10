import "./TransactionListItem.scss";
import React, { useCallback, useState } from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import {
	Plus as PlusIcon,
	Minus as MinusIcon,
} from "react-feather"
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Close as CloseIcon
} from "@material-ui/icons"
import useLongPress from "../../hooks/useLongPress";
import { Button, IconButton } from "@material-ui/core";
import { Type } from "../Type/Type";

export type TransactionListItemViewProps = {
	transaction: Transaction;
	onDelete(): void;
	onCancelDelete(): void;
	deleting: boolean;
	onEdit(): void;
}

export function TransactionListItemView(props: TransactionListItemViewProps) {

	const signClass = props.transaction.amount.isPositive ? "positive" : "negative"

	const [actionOverlayActive, setActionOverlayActive] = useState(false)

	const handleLongPress = useCallback(() => setActionOverlayActive(true), [])

	const longPress = useLongPress(handleLongPress)

	/**
	 * After deleting, show "deleted" screen with cancel delete option
	 */
	if (props.deleting) {
		return <div className="TransactionListItem deleting">
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

	return <div
		className={cx("TransactionListItem", { pressed: longPress.pressed })}
		{...longPress.props}
	>

		{
			/**
			 * After long press, show the action overlay screen
			 */
			actionOverlayActive ? <div
				className="actionOverlay"
				onClick={e => {
					if (e.target === e.currentTarget) {
						setActionOverlayActive(false)
					}
				}}
			>
				<IconButton
					className="editAction"
					onClick={props.onEdit}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					className="deleteAction"
					onClick={props.onDelete}
				>
					<DeleteIcon />
				</IconButton>
				<IconButton
					className="closeAction"
					onClick={() => { setActionOverlayActive(false) }}
				>
					<CloseIcon />
				</IconButton>
			</div> : null
		}

		<div className={cx("icon", signClass)}>
			<div className="iconContainer">
				{
					props.transaction.amount.isPositive
						? <PlusIcon />
						: <MinusIcon />
				}
			</div>
		</div>
		<div className="category">
			<span>
				{props.transaction.category}
			</span>
		</div>
		<div className="comment">
			<span>
				{props.transaction.comment}
			</span>
		</div>
		<div className={cx("amount", signClass)}>
			<span>
				{props.transaction.amount.format()}
			</span>
		</div>
	</div>
}