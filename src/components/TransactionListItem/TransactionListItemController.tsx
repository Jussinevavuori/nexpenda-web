import React, { useCallback } from "react"
import { TransactionListItemView } from "./TransactionListItemView"
import { Transaction } from "../../classes/Transaction"
import { useStoreActions } from "../../store"

export type TransactionListItemProps = {
	transaction: Transaction;
}

export function TransactionListItem(props: TransactionListItemProps) {

	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)

	const handleDelete = useCallback(() => {
		deleteTransaction(props.transaction.id)
	}, [props.transaction, deleteTransaction])

	return <TransactionListItemView
		transaction={props.transaction}
		handleDelete={handleDelete}
	/>
}