import "./TransactionListItem.scss";
import React, { useCallback } from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import {
	Plus as PlusIcon,
	Minus as MinusIcon,
	Check as SelectedIcon,
} from "react-feather"
import useLongPress from "../../hooks/useLongPress";

export type TransactionListItemViewProps = {
	transaction: Transaction;

	selected: boolean;
	onSelect(): void;
	onDeselect(): void;
	selectionActive: boolean;
}

export function TransactionListItemView(props: TransactionListItemViewProps) {

	const { onSelect } = props

	const signClass = props.transaction.amount.isPositive ? "positive" : "negative"

	const handleLongPress = useCallback(() => onSelect(), [onSelect])

	const longPress = useLongPress(handleLongPress)

	return <div
		className={cx("TransactionListItem", { pressed: longPress.pressed })}
		{...(props.selectionActive ? {
			onClick() {
				props.selected ? props.onDeselect() : props.onSelect()
			},
		} : longPress.props)}
	>
		<div className={cx("icon", signClass, { selected: props.selected, selectionActive: props.selectionActive })}>
			<div
				className="iconContainer"
				onClick={e => {
					e.stopPropagation()
					props.selected ? props.onDeselect() : props.onSelect()
				}}
			>
				{
					props.selectionActive
						? props.selected
							? <SelectedIcon />
							: null
						: props.transaction.amount.isPositive
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
	</div >
}