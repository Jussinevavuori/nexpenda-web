import React, { useCallback } from "react"
import { TransactionListItemView } from "./TransactionListItemView"
import { Transaction } from "../../classes/Transaction"
import { useStoreActions } from "../../store"
import { useDelayedAction } from "../../hooks/useDelayedAction"

export type TransactionListItemProps = {
	transaction: Transaction;
}

export function TransactionListItem(props: TransactionListItemProps) {

	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)

	const handleDelete = useCallback(async () => {
		const deletion = await deleteTransaction(props.transaction.id)
		if (deletion.isFailure()) {
			console.error(deletion)
		}
	}, [deleteTransaction, props.transaction])

	const delayedDeleteAction = useDelayedAction(handleDelete, 5000)

	return <TransactionListItemView
		transaction={props.transaction}
		onDelete={delayedDeleteAction.start}
		onCancelDelete={delayedDeleteAction.cancel}
		deleting={delayedDeleteAction.active}
		onEdit={() => void 0}
	/>
}