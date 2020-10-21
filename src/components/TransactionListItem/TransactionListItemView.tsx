import "./TransactionListItem.scss";
import React, { useCallback, useMemo } from "react"
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

	const { selected, onSelect, onDeselect, selectionActive } = props

	const signClass = props.transaction.amount.isPositive ? "positive" : "negative"

	/**
	 * Long presses acts as toggle
	 */
	const handleLongPress = useCallback(() => {
		if (selected) {
			onDeselect()
		} else {
			onSelect()
		}
	}, [onSelect, onDeselect, selected])

	/**
	 * No timeout when selected, else default timeout
	 */
	const longPressTimeout = useMemo(() => {
		return selectionActive ? 0 : undefined
	}, [selectionActive])

	const pressHandler = useLongPress(handleLongPress, {
		pressTimeInMs: longPressTimeout
	})

	return <div
		className={cx("TransactionListItem", { pressed: pressHandler.pressed })}
		{...pressHandler.props}
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