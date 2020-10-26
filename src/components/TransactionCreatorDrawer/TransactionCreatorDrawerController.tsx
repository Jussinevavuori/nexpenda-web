import React from "react"
import { useHashOpenState } from "../../hooks/useHashOpenState"
import { TransactionCreatorDrawerView } from "./TransactionCreatorDrawerView"

export type TransactionCreatorDrawerProps = {

}

export const TransactionCreatorDrawerOpenHash = "create"

export function useTransactionCreatorDrawerOpenState() {
	return useHashOpenState(TransactionCreatorDrawerOpenHash)
}

export function TransactionCreatorDrawer(props: TransactionCreatorDrawerProps) {

	const [open, setOpen] = useTransactionCreatorDrawerOpenState()

	return <TransactionCreatorDrawerView

		open={open}
		onOpen={() => setOpen(true)}
		onClose={() => setOpen(false)}

	/>
}