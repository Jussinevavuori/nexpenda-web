import { createRef, useCallback, useEffect, useMemo, useState } from "react"
import { List } from "react-virtualized"
import { useXlMedia } from "../../hooks/utils/useMedia";
import { Transaction } from "../../classes/Transaction"
import { useStoreState } from "../../store"
import { TransactionTableProps } from "./TransactionTable"
import { useTransactionEditorOpenState } from "../../hooks/componentStates/useTransactionEditorOpenState";

const virtualizedListRef = createRef<List>()

export function useTransactionTableController(props: TransactionTableProps) {
	const isLargeScreen = useXlMedia()
	const items = useStoreState(_ => _.transactions.filteredItems)
	const sortingStrategy = useStoreState(_ => _.transactions.sortingStrategy)
	const [isUpcomingOpen, setIsUpcomingOpen] = useState(false)

	const { openedId: editingId } = useTransactionEditorOpenState()

	const {
		allSortedItems,
		sortedItems,
		sortedUpcomingItems,
		// itemsCount,
		upcomingItemsCount
	} = useMemo(() => {
		const allSortedItems = items.sort((a, b) => Transaction.compare(a, b, sortingStrategy))
		let sortedItems: Transaction[] = []
		let sortedUpcomingItems: Transaction[] = []
		let itemsCount = 0
		let upcomingItemsCount = 0
		allSortedItems.forEach(item => {
			if (item.isUpcoming) {
				upcomingItemsCount++;
				sortedUpcomingItems.push(item)
			} else {
				itemsCount++;
				sortedItems.push(item)
			}
		})
		return {
			allSortedItems,
			sortedItems,
			sortedUpcomingItems,
			itemsCount,
			upcomingItemsCount
		}
	}, [items, sortingStrategy])

	const getAllTransactionIdsBetween = useCallback((aid: string, bid: string): string[] => {
		if (aid === bid) return [aid]
		const aidx = allSortedItems.findIndex(_ => _.id === aid)
		const bidx = allSortedItems.findIndex(_ => _.id === bid)
		if (aidx === -1 || bidx === -1) return []
		const ids: string[] = []
		const lidx = Math.min(aidx, bidx)
		const gidx = Math.max(aidx, bidx)
		for (let i = lidx; i <= gidx; i++) {
			const id = allSortedItems[i]?.id
			if (id) ids.push(id)
		}
		return ids
	}, [allSortedItems])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons



	// Calculates row heights
	function calculateRowHeight(index: number) {
		const rowHeight = 40
		const editingHeight = isLargeScreen ? 60 : 110


		// Upcoming items
		if (index === 0) {
			const baseHeight = 32
			if (!upcomingItemsCount) {
				return 0
			} else if (isUpcomingOpen) {
				return baseHeight + sortedUpcomingItems.reduce((h, item) => {
					return h + (item.id === editingId ? editingHeight : rowHeight)
				}, 0)
			} else {
				return baseHeight
			}
		}

		// Default
		return sortedItems[index - 1].id === editingId
			? editingHeight
			: rowHeight
	}

	// Recalculate virtualized list row heights each time the 
	// props change
	useEffect(() => {
		const virtualizedList = virtualizedListRef.current
		if (virtualizedList) {
			virtualizedList.recomputeRowHeights()
		}
	}, [props, isUpcomingOpen, editingId, isLargeScreen, items])

	return {
		items: sortedItems,
		upcomingItems: sortedUpcomingItems,
		upcomingItemsCount,
		hasUpcomingItems: !!upcomingItemsCount,
		rowCount: sortedItems.length + sortedUpcomingItems.length > 0
			? sortedItems.length + 1
			: 0,
		showSkeletons,
		editingId,
		getAllTransactionIdsBetween,
		isUpcomingOpen,
		handleToggleIsUpcomingOpen() {
			setIsUpcomingOpen(_ => !_)
		},
		calculateRowHeight,
		isLargeScreen,
		virtualizedListRef,
	}
}