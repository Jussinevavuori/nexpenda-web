import React from "react"
import { TransactionListView } from "./TransactionListView"
import { useStoreState } from "../../store"
import { TransactionContextMenuProvider } from "../../contexts/TransactionContextMenu.context"

export type TransactionListProps = {
	bypassFilters?: boolean;
	showSkeletons?: boolean;
}

export function TransactionList(props: TransactionListProps) {

	const itemsByDates = useStoreState(_ => _.transactions.itemsByDates)
	const filteredItemsByDates = useStoreState(_ => _.transactions.filtered.itemsByDates)

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	return <TransactionContextMenuProvider>
		<TransactionListView
			itemsByDates={props.bypassFilters ? itemsByDates : filteredItemsByDates}
			showSkeletons={showSkeletons}
		/>
	</TransactionContextMenuProvider>
}