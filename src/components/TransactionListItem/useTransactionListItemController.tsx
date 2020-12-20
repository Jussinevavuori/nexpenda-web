import React, { useCallback, useMemo } from "react"
import { isMobile } from "react-device-detect"
import { useStoreActions, useStoreState } from "../../store"
import { useTransactionContextMenu } from "../../contexts/TransactionContextMenu.context"
import { TransactionListItemProps } from "./TransactionListItem"

export function useTransactionListItemController(props: TransactionListItemProps) {

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
		if (isMobile) {
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

	return {
		selected: selected || contextMenuSelected,
		handleSelect,
		handleDeselect,
		selectionActive,
		handleContextMenu,
	}
}