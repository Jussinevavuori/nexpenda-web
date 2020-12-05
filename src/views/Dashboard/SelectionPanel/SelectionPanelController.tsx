import React, { useCallback, useMemo } from "react"
import { useStoreActions, useStoreState } from "../../../store"
import { DataUtils } from "../../../utils/DataUtils/DataUtils"
import { useTransactionEditorDrawerVariableOpenState } from "../../../components/TransactionEditorDrawer/TransactionEditorDrawerController"
import { SelectionPanelView } from "./SelectionPanelView"


export type SelectionPanelProps = {

}

export function SelectionPanel(props: SelectionPanelProps) {

	/**
	 * Selection
	 */
	const selection = useStoreState(_ => _.selection.selection)

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

	return <SelectionPanelView
		selection={selection}

		onSelectAll={handleSelectAll}
		onDeselectAll={handleDeselectAll}
		onEdit={handleEdit}
		onDelete={handleDelete}

		allSelected={allSelected}
	/>
}