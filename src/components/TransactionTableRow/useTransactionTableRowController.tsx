import React, { useCallback, useMemo } from "react"
import { useTransactionContextMenu } from "../../contexts/TransactionContextMenu.context"
import { useStoreActions, useStoreState } from "../../store"
import { useTransactionEditorDrawerVariableOpenState } from "../TransactionEditorDrawer/useTransactionEditorDrawerController"
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
	 * Handle click
	 */
	const handleClick = useCallback((e: React.MouseEvent) => {
		if (selected) {
			handleDeselect()
		} else {
			handleSelect()
		}
	}, [handleDeselect, handleSelect, selected])

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

		selected: selected || contextMenuSelected,
		selectionActive: selectionActive,
		onSelect: handleSelect,
		onDeselect: handleDeselect,
	}
}