import React, { useCallback, useMemo } from "react"
import Device from "react-device-detect"
import { TransactionListItemView } from "./TransactionListItemView"
import { Transaction } from "../../classes/Transaction"
import { useStoreActions, useStoreState } from "../../store"
import { useTransactionContextMenu } from "../../contexts/TransactionContextMenu.context"

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

	/**
	 * Handle context menu
	 */
	const contextMenu = useTransactionContextMenu()
	const handleContextMenu = useCallback((e: React.MouseEvent) => {
		e.preventDefault()
		if (Device.isMobile) {
			return
		}
		contextMenu.setPosition({ top: e.clientY, left: e.clientX })
		contextMenu.setTransaction(props.transaction)
	}, [contextMenu, props.transaction])
	const contextMenuSelected = useMemo(() => {
		if (contextMenu.transaction) {
			return contextMenu.transaction.id === props.transaction.id
		}
		return false
	}, [contextMenu, props.transaction])


	return <TransactionListItemView
		transaction={props.transaction}

		selected={selected || contextMenuSelected}
		onSelect={handleSelect}
		onDeselect={handleDeselect}
		selectionActive={selectionActive}

		onContextMenu={handleContextMenu}
	/>
}