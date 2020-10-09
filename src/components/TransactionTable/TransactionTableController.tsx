import React from "react"
import { useStoreState } from "../../store"
import { TransactionTableView } from "./TransactionTableView"

export type TransactionTableProps = {
	bypassFilters?: boolean;
}

export function TransactionTable(props: TransactionTableProps) {

	const items = useStoreState(_ => _.transactions.items)
	const filteredItems = useStoreState(_ => _.transactions.filtered.items)

	const selectedItems = (props.bypassFilters ? items : filteredItems).reverse()

	return <TransactionTableView
		items={selectedItems}
	/>
}