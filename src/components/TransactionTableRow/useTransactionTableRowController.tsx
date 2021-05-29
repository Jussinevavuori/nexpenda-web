import React, { useCallback, useMemo } from "react"
import { useTransactionContextMenu } from "../../contexts/TransactionContextMenu.context"
import { useTransactionEditorDrawerVariableOpenState } from "../../hooks/componentStates/useTransactionEditorDrawerVariableOpenState"
import { useStoreActions, useStoreState } from "../../store"
import { TransactionTableRowProps } from "./TransactionTableRow"

export function useTransactionTableRowController(props: TransactionTableRowProps) {
	/**
	 * Selected
	 */
	const selection = useStoreState(_ => _.selection.selection)
	const selected = useMemo(() => {
		return selection.some(_ => _.id === props.transaction.id)
	}, [props.transaction, selection])

	/**
	 * Is the transaction being edited.
	 */
	const [editingId, setEditingId] = useTransactionEditorDrawerVariableOpenState()
	const isEditing = useMemo(() => {
		return editingId === props.transaction.id
	}, [editingId, props.transaction])
	const handleCloseEditing = useCallback(() => {
		setEditingId(null)
	}, [setEditingId])

	const select = useStoreActions(_ => _.selection.select)
	const selectAll = useStoreActions(_ => _.selection.selectAll)
	const deselect = useStoreActions(_ => _.selection.deselect)
	const deselectAll = useStoreActions(_ => _.selection.deselectAll)

	/**
	 * Selection active
	 */
	const selectionActive = useStoreState(_ => _.selection.selectionActive)

	/**
	 * Handle click
	 */
	const handleClick = useCallback((e: React.MouseEvent) => {
		const isShift = e.shiftKey
		const isCtrl = e.ctrlKey

		if (isShift) {
			if (selection.length === 0) {
				select(props.transaction.id)
			} else {
				selectAll(
					props.getAllTransactionIdsBetween(
						props.transaction.id,
						selection[0].id
					)
				)
			}
		} else {
			if (selected) {
				if (selection.length <= 1) {
					deselect(props.transaction.id)
				} else {
					if (!isCtrl) {
						deselectAll()
						select(props.transaction.id)
					} else {
						deselect(props.transaction.id)
					}
				}
			} else {
				if (!isCtrl) {
					deselectAll()
				}
				select(props.transaction.id)
			}
		}
	}, [selection, deselect, deselectAll, select, selected, selectAll, props])

	/**
	 * Handle context menu
	 */
	const contextMenu = useTransactionContextMenu()
	const handleContextMenu = useCallback((e: React.MouseEvent) => {
		e.preventDefault()
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
		transaction: props.transaction,

		onClick: handleClick,
		onContextMenu: handleContextMenu,

		isEditing,
		onCloseEditing: handleCloseEditing,

		selected,
		contextMenuSelected,
		selectionActive,
		onSelect: () => select(props.transaction.id),
		onDeselect: () => deselect(props.transaction.id),
	}
}