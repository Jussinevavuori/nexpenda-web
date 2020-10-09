import React, { useRef, useState } from "react"
import { Transaction } from "../../classes/Transaction"
import { useMountedRef } from "../../hooks/useMountedRef"
import { useStoreActions } from "../../store"
import { TransactionTableRowView } from "./TransactionTableRowView"

export type TransactionTableRowProps = {
	transaction: Transaction;
}

export function TransactionTableRow(props: TransactionTableRowProps) {

	const mounted = useMountedRef()

	const deleteTransaction = useStoreActions(_ => _.transactions.deleteTransaction)

	/**
	 * Deletion state: when deleting and not yet committed delete, set this
	 * to true, to enable cancelation of deletion.
	 */
	const [deleting, setDeleting] = useState(false)

	/**
	 * Deletion timeout ref
	 */
	const deletionTimeout = useRef<NodeJS.Timeout | null>(null)

	/**
	 * Initialize deletion
	 */
	function handleDelete() {
		setDeleting(true)
		deletionTimeout.current = setTimeout(async () => {
			if (mounted.current) {
				setDeleting(false)
			}
			const deletion = await deleteTransaction(props.transaction.id)
			if (deletion.isFailure()) {
				console.error(deletion)
			}
		}, 5000)
	}

	function handleCancelDelete() {
		if (deletionTimeout.current) {
			clearTimeout(deletionTimeout.current)
		}
		setDeleting(false)
	}

	return <TransactionTableRowView
		transaction={props.transaction}
		deleting={deleting}
		onDelete={handleDelete}
		onCancelDelete={handleCancelDelete}
	/>
}