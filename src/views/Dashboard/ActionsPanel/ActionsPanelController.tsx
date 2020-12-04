import React, { useCallback, useMemo } from "react"
import { ActionsPanelView } from "./ActionsPanelView"
import { useStoreState, useStoreActions } from "../../../store"
import { DataUtils } from "../../../utils/DataUtils/DataUtils"
import { useTransactionEditorDrawerVariableOpenState } from "../../../components/TransactionEditorDrawer/TransactionEditorDrawerController"
import { useFiltersDrawerOpenState } from "../../../components/FiltersDrawer/FiltersDrawerController"
import { useTransactionCreatorDrawerOpenState } from "../../../components/TransactionCreatorDrawer/TransactionCreatorDrawerController"

export type ActionsPanelProps = {
}

export function ActionsPanel(props: ActionsPanelProps) {

	/**
	 * Selection
	 */
	const selection = useStoreState(_ => _.selection.selection)

	/**
	 * Is the selection active
	 */
	const isSelectionActive = useStoreState(_ => _.selection.selectionActive)

	/**
	 * Deselect all
	 */
	const deselectAll = useStoreActions(_ => _.selection.deselectAll)
	const handleDeselectAll = useCallback(() => {
		deselectAll()
	}, [deselectAll])

	/**
	 * Select all
	 */
	const filteredTransactions = useStoreState(_ => _.transactions.filtered.items)
	const selectAll = useStoreActions(_ => _.selection.selectAll)
	const handleSelectAll = useCallback(() => {
		selectAll(filteredTransactions.map(_ => _.id))
	}, [selectAll, filteredTransactions])

	/**
	 * All selected
	 */
	const allSelected = useMemo(() => {
		return DataUtils.compareArrays(
			filteredTransactions.map(_ => _.id),
			selection.map(_ => _.id),
		)
	}, [filteredTransactions, selection])

	/**
	 * Deletion
	 */
	const deleteTransactions = useStoreActions(_ => _.transactions.deleteTransactions)
	const handleDelete = useCallback(async () => {
		deleteTransactions(selection.map(_ => _.id))
		deselectAll()
	}, [deleteTransactions, selection, deselectAll])

	/**
	 * Editor drawer
	 */
	const [, setEditor] = useTransactionEditorDrawerVariableOpenState()
	const handleEdit = useCallback(() => {
		if (selection.length === 1) {
			setEditor(selection[0].id)
			deselectAll()
		}
	}, [selection, setEditor, deselectAll])

	/**
	 * Filters drawer
	 */
	const [, setFiltersDrawerOpen] = useFiltersDrawerOpenState()
	const handleFilter = useCallback(() => {
		setFiltersDrawerOpen(true)
	}, [setFiltersDrawerOpen])

	/**
	 * Create transaction drawer
	 */
	const [, setCreateDrawerOpen] = useTransactionCreatorDrawerOpenState()
	const handleCreate = useCallback(() => {
		setCreateDrawerOpen(true)
	}, [setCreateDrawerOpen])

	return <ActionsPanelView
		selection={selection}
		onSelectAll={handleSelectAll}
		onDeselectAll={handleDeselectAll}
		allSelected={allSelected}
		isSelectionActive={isSelectionActive}
		onEdit={handleEdit}
		onDelete={handleDelete}
		onFilter={handleFilter}
		onCreate={handleCreate}
	/>
}