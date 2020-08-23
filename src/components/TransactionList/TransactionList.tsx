import React from "react"
import { TransactionListView } from "./TransactionListView"
import { useStoreState } from "../../store"

export type TransactionListProps = {

}

export function TransactionList(props: TransactionListProps) {

	const itemsByDates = useStoreState(_ => _.transactions.itemsByDates)

	return <TransactionListView
		itemsByDates={itemsByDates}
	/>
}