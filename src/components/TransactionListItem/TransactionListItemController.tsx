import React, { useCallback, useMemo } from "react"
import { TransactionListItemView } from "./TransactionListItemView"
import { Transaction } from "../../classes/Transaction"
import { useStoreActions, useStoreState } from "../../store"

export type TransactionListItemProps = {
	transaction: Transaction;
}

export function TransactionListItem(props: TransactionListItemProps) {

	/**
	 * Selected
	 */
	const selection = useStoreState(_ => _.selection.selection)
	const selected = useMemo(() => {
		return selection.some(_ => _.id === props.transaction.id)
	}, [props.transaction, selection])

	/**
	 * Handle selection
	 */
	const select = useStoreActions(_ => _.selection.select)
	const handleSelect = useCallback(() => {
		select(props.transaction.id)
	}, [props.transaction, select])

	/**
	 * Handle deselection
	 */
	const deselect = useStoreActions(_ => _.selection.deselect)
	const handleDeselect = useCallback(() => {
		deselect(props.transaction.id)
	}, [props.transaction, deselect])

	/**
	 * Selection active
	 */
	const selectionActive = useStoreState(_ => _.selection.selectionActive)

	return <TransactionListItemView
		transaction={props.transaction}

		selected={selected}
		onSelect={handleSelect}
		onDeselect={handleDeselect}
		selectionActive={selectionActive}
	/>
}