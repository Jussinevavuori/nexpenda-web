import React, { useMemo } from "react"
import { useStoreState } from "../../store"
import { TransactionTableView } from "./TransactionTableView"

export type TransactionTableProps = {
	bypassFilters?: boolean;
}

export function TransactionTable(props: TransactionTableProps) {

	const items = useStoreState(_ => _.transactions.items)
	const filteredItems = useStoreState(_ => _.transactions.filtered.items)

	const selectedItems = useMemo(() => {
		const selection = props.bypassFilters ? items : filteredItems
		return selection.sort((a, b) => a.date.getTime() - b.date.getTime())
	}, [props, items, filteredItems])

	return <TransactionTableView
		items={selectedItems}
	/>
}