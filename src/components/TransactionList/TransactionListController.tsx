import React from "react"
import { TransactionListView } from "./TransactionListView"
import { useStoreState } from "../../store"
import { TransactionContextMenuProvider } from "../../contexts/TransactionContextMenu.context"

export type TransactionListProps = {
	bypassFilters?: boolean;
}

export function TransactionList(props: TransactionListProps) {

	const itemsByDates = useStoreState(_ => _.transactions.itemsByDates)
	const filteredItemsByDates = useStoreState(_ => _.transactions.filtered.itemsByDates)

	return <TransactionContextMenuProvider>
		<TransactionListView
			itemsByDates={props.bypassFilters ? itemsByDates : filteredItemsByDates}
		/>
	</TransactionContextMenuProvider>
}