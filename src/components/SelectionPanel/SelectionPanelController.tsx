import React, { useCallback, useMemo } from "react"
import { useDelayedAction } from "../../hooks/useDelayedAction"
import { useStoreActions, useStoreState } from "../../store"
import { DataUtils } from "../../utils/DataUtils/DataUtils"
import { ProcessQueue } from "../../utils/ProcessQueue/ProcessQueue"
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
	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)
	const hideTransaction = useStoreActions(_ => _.filters.hideId)
	const resetHiddenTransactions = useStoreActions(_ => _.filters.resetHiddenIds)
	const handleDelete = useCallback(async () => {
		new ProcessQueue({
			queue: selection.map(transaction => () => {
				deleteTransaction(transaction.id)
			})
		})
	}, [deleteTransaction, selection])
	const delayedDeleteAction = useDelayedAction(handleDelete, {
		delayInMs: 5000,
		onStart() {
			selection.forEach(item => hideTransaction(item.id))
		},
		onCancel() {
			resetHiddenTransactions()
		},
	})

	return <SelectionPanelView
		selection={selection}
		onSelectAll={handleSelectAll}
		onDeselectAll={handleDeselectAll}
		allSelected={allSelected}

		onDelete={delayedDeleteAction.start}
		onCancelDelete={delayedDeleteAction.cancel}
		deleted={delayedDeleteAction.active}
	/>
}