import React, { useMemo } from "react"
import { TransactionContextMenuProvider } from "../../contexts/TransactionContextMenu.context"
import { useStoreState } from "../../store"
import { TransactionTableView } from "./TransactionTableView"

export type TransactionTableProps = {
	bypassFilters?: boolean;
	showSkeletons?: boolean;
}

export function TransactionTable(props: TransactionTableProps) {

	const items = useStoreState(_ => _.transactions.items)
	const filteredItems = useStoreState(_ => _.transactions.filtered.items)

	const selectedItems = useMemo(() => {
		const selection = props.bypassFilters ? items : filteredItems
		return selection.sort((a, b) => a.date.getTime() - b.date.getTime())
	}, [props, items, filteredItems])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	return <TransactionContextMenuProvider>
		<TransactionTableView
			items={selectedItems}
			showSkeletons={showSkeletons}
		/>
	</TransactionContextMenuProvider>
}