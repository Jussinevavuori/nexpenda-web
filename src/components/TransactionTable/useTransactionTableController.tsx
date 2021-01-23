import { useMemo } from "react"
import { Transaction } from "../../classes/Transaction"
import { useStoreState } from "../../store"
import { TransactionTableProps } from "./TransactionTable"

export function useTransactionTableController(props: TransactionTableProps) {

	const items = useStoreState(_ => _.transactions.filteredItems)
	const sortingStrategy = useStoreState(_ => _.transactions.sort.strategy)

	const sortedItems = useMemo(() => {
		return items.sort((a, b) => Transaction.compare(a, b, sortingStrategy))
	}, [items, sortingStrategy])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	return { items: sortedItems, showSkeletons }
}