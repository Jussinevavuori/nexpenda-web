import React, { useMemo } from "react"
import { Transaction } from "../../classes/Transaction"
import { TransactionContextMenuProvider } from "../../contexts/TransactionContextMenu.context"
import { useStoreState } from "../../store"
import { TransactionTableView } from "./TransactionTableView"

export type TransactionTableProps = {
	showSkeletons?: boolean;
}

export function TransactionTable(props: TransactionTableProps) {

	const items = useStoreState(_ => _.transactions.filtered.items)
	const sortingStrategy = useStoreState(_ => _.transactions.sort.strategy)

	const sortedItems = useMemo(() => {
		return items.sort((a, b) => Transaction.compare(a, b, sortingStrategy))
	}, [items, sortingStrategy])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	return <TransactionContextMenuProvider>
		<TransactionTableView
			items={sortedItems}
			showSkeletons={showSkeletons}
		/>
	</TransactionContextMenuProvider>
}