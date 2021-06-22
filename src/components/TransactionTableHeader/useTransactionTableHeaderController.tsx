import { useMemo } from "react"
import { compareArrays } from "../../lib/Utilities/compareArrays"
import { useStoreActions, useStoreState } from "../../store"
import { TransactionTableHeaderProps } from "./TransactionTableHeader"


export function useTransactionTableHeaderController(props: TransactionTableHeaderProps) {

	const selection = useStoreState(_ => _.selection.selection)
	const transactions = useStoreState(_ => _.transactions.filteredItems)

	const toggleSort = useStoreActions(_ => _.transactions.toggleSortingStrategy)

	const sortingStrategy = useStoreState(_ => _.transactions.sortingStrategy)

	const isSelectionActive = useStoreState(_ => _.selection.selectionActive)
	const isAllSelected = useMemo(() => {
		return compareArrays(transactions.map(_ => _.id), selection.map(_ => _.id))
	}, [transactions, selection])

	const handleSelectAll = useStoreActions(_ => _.selection.selectAll)
	const handleDeselectAll = useStoreActions(_ => _.selection.deselectAll)

	return {
		isSelectionActive: isSelectionActive,
		isAllSelected: isAllSelected,
		onSelectAll: () => handleSelectAll(transactions.map(_ => _.id)),
		onDeselectAll: () => handleDeselectAll(),
		sortingStrategy: sortingStrategy,
		onToggleSort: toggleSort,
	}
}