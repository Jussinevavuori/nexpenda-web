import React, { useCallback } from "react"
import { TransactionListingView } from "./TransactionListingView"
import { Transaction } from "../../classes/Transaction"
import { useStoreActions } from "../../store"

export type TransactionListingProps = {
	transaction: Transaction;
}

export function TransactionListing(props: TransactionListingProps) {

	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)

	const handleDelete = useCallback(() => {
		deleteTransaction(props.transaction.id)
	}, [props.transaction, deleteTransaction])

	return <TransactionListingView
		transaction={props.transaction}
		handleDelete={handleDelete}
	/>
}