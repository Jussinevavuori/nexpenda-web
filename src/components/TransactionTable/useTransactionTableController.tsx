import { useCallback, useMemo } from "react"
import { Transaction } from "../../classes/Transaction"
import { useStoreState } from "../../store"
import { useTransactionEditorDrawerVariableOpenState } from "../TransactionEditorDrawer/useTransactionEditorDrawerController"
import { TransactionTableProps } from "./TransactionTable"

export function useTransactionTableController(props: TransactionTableProps) {

	const items = useStoreState(_ => _.transactions.filteredItems)
	const sortingStrategy = useStoreState(_ => _.transactions.sortingStrategy)

	const [editingId] = useTransactionEditorDrawerVariableOpenState()

	const sortedItems = useMemo(() => {
		return items.sort((a, b) => Transaction.compare(a, b, sortingStrategy))
	}, [items, sortingStrategy])

	const getAllTransactionIdsBetween = useCallback((aid: string, bid: string): string[] => {
		if (aid === bid) return [aid]
		const aidx = sortedItems.findIndex(_ => _.id === aid)
		const bidx = sortedItems.findIndex(_ => _.id === bid)
		if (aidx === -1 || bidx === -1) return []
		const ids: string[] = []
		const lidx = Math.min(aidx, bidx)
		const gidx = Math.max(aidx, bidx)
		for (let i = lidx; i <= gidx; i++) {
			const id = sortedItems[i]?.id
			if (id) ids.push(id)
		}
		return ids
	}, [sortedItems])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	return {
		items: sortedItems,
		showSkeletons,
		editingId,
		getAllTransactionIdsBetween
	}
}