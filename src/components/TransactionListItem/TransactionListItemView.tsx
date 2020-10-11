import "./TransactionListItem.scss";
import React, { useCallback } from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import {
	Plus as PlusIcon,
	Minus as MinusIcon,
} from "react-feather"
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
} from "@material-ui/icons"
import useLongPress from "../../hooks/useLongPress";
import { Button, Drawer } from "@material-ui/core";
import { Type } from "../Type/Type";
import { useHashOpenState } from "../../hooks/useHashOpenState";
import { useLgMedia } from "../../hooks/useMedia";

export type TransactionListItemViewProps = {
	transaction: Transaction;
	onDelete(): void;
	onCancelDelete(): void;
	deleting: boolean;
	onEdit(): void;
}

export function TransactionListItemView(props: TransactionListItemViewProps) {

	const signClass = props.transaction.amount.isPositive ? "positive" : "negative"

	const [drawerOpen, setDrawerOpen] = useHashOpenState(`options-${props.transaction.id}`)

	const handleLongPress = useCallback(() => setDrawerOpen(true), [setDrawerOpen])

	const longPress = useLongPress(handleLongPress)

	const largeScreen = useLgMedia()

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

	return <>

		<Drawer
			className="TransactionListItem_actionsDrawer"
			open={drawerOpen}
			onClose={() => setDrawerOpen(false)}
			anchor={largeScreen ? "right" : "bottom"}
		>
			<div className="actionsDrawerActions">
				<Button
					color="primary"
					className="editAction"
					onClick={() => {
						setDrawerOpen(false)
						props.onEdit()
					}}
					startIcon={<EditIcon />}
				>
					{"Edit"}
				</Button>
				<Button
					className="deleteAction"
					onClick={() => {
						setDrawerOpen(false)
						props.onDelete()
					}}
					startIcon={<DeleteIcon />}
				>
					{"Delete"}
				</Button>
				<Button
					className="closeAction"
					onClick={() => setDrawerOpen(false)}
				>
					{"Close"}
				</Button>
			</div>
		</Drawer>


		<div
			className={cx("TransactionListItem", { pressed: longPress.pressed })}
			{...longPress.props}
		>
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

	</>
}