import "./TransactionListItem.scss";
import React, { useCallback, useMemo } from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import {
	Check as SelectedIcon,
} from "react-feather"
import useLongPress from "../../hooks/useLongPress";
import { useVibration } from "../../hooks/useVibration";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";

export type TransactionListItemViewProps = {
	transaction: Transaction;

	onContextMenu(e: React.MouseEvent): void;

	selected: boolean;
	onSelect(): void;
	onDeselect(): void;
	selectionActive: boolean;
}

export function TransactionListItemView(props: TransactionListItemViewProps) {

	const { selected, onSelect, onDeselect, selectionActive } = props

	const vibrate = useVibration()

	/**
	 * Long presses acts as toggle: this function is the callback when a long
	 * press activates
	 */
	const handleLongPress = useCallback(() => {
		if (selectionActive) {
			vibrate("weak")
		}
		if (selected) {
			onDeselect()
		} else {
			onSelect()
		}
	}, [onSelect, onDeselect, selected, selectionActive, vibrate])

	/**
	 * No timeout when selected, else default timeout for long presses
	 */
	const longPressTimeout = useMemo(() => {
		return selectionActive ? 0 : undefined
	}, [selectionActive])

	/**
	 * Long press handler
	 */
	const pressHandler = useLongPress(handleLongPress, {
		pressTimeInMs: longPressTimeout,
		disableVibrate: selectionActive,
	})

	return <div
		className={cx("TransactionListItem", { pressed: pressHandler.pressed })}
		{...pressHandler.props}
		onContextMenu={e => {
			e.stopPropagation()
			props.onContextMenu(e)
		}}
	>
		<div className={cx("icon", { pressed: pressHandler.pressed, selected: props.selected, selectionActive: props.selectionActive })}>
			<div
				className="iconContainer"
				onClick={e => {
					if (props.selected) {
						props.onDeselect()
					} else {
						props.onSelect()
					}
					vibrate("weak")
				}}
				{...pressHandler.childlockProps}
			>
				{
					props.selectionActive
						? props.selected
							? <SelectedIcon />
							: null
						: props.transaction.amount.isPositive
							? <span className="emoji">{"💰"}</span>
							: <span className="emoji">{"💸"}</span>
				}
			</div>
		</div>
		<div className="category">
			<Type color="gray-800" size="md" variant="bold">
				{props.transaction.category}
			</Type>
		</div>
		<div className="comment">
			<Type color="gray-600" size="md" variant="regular">
				{props.transaction.comment}
			</Type>
		</div>
		<div className={cx("amount")}>
			<MoneyType
				amount={props.transaction.amount}
				colorIfPositive="green-600"
				colorIfNegative="red-600"
				size="lg"
				variant="bold"
			/>
		</div>
	</div >
}