import React, { useCallback } from "react"
import { Transaction } from "../../classes/Transaction"
import { useDelayedAction } from "../../hooks/useDelayedAction"
import { useStoreActions, useStoreState } from "../../store"
import { TransactionTableRowView } from "./TransactionTableRowView"

export type TransactionTableRowProps = {
	transaction: Transaction;
}

export function TransactionTableRow(props: TransactionTableRowProps) {

	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)
	const selectCategoryFilter = useStoreActions(_ => _.filters.selectCategory)
	const deselectCategoryFilter = useStoreActions(_ => _.filters.deselectCategory)
	const categoryFilter = useStoreState(_ => _.filters.categories)

	const handleDelete = useCallback(async () => {
		const deletion = await deleteTransaction(props.transaction.id)
		if (deletion.isFailure()) {
			console.error(deletion)
		}
	}, [deleteTransaction, props.transaction])

	const delayedDeleteAction = useDelayedAction(handleDelete, 5000)

	/**
	 * Handle category select and deselect
	 */
	const handleCategorySelect = useCallback(() => {
		const category = props.transaction.category
		if (categoryFilter.includes(category)) {
			deselectCategoryFilter(category)
		} else {
			selectCategoryFilter(category)
		}
	}, [categoryFilter, deselectCategoryFilter, selectCategoryFilter, props.transaction])

	return <TransactionTableRowView
		transaction={props.transaction}
		deleting={delayedDeleteAction.active}
		onDelete={delayedDeleteAction.start}
		onCancelDelete={delayedDeleteAction.cancel}
		onSelectCategory={handleCategorySelect}
	/>
}