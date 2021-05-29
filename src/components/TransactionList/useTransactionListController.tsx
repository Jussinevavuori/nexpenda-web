import { createRef, useMemo, useCallback, useState, useEffect } from "react"
import { List } from "react-virtualized"
import { useTransactionCreatorDrawerOpenState } from "../../hooks/componentStates/useTransactionCreatorDrawerOpenState"
import { useStoreState } from "../../store"
import { theme } from "../../styles/main"
import { DateUtils } from "../../utils/DateUtils/DateUtils"
import { TransactionListProps } from "./TransactionList"


const virtualizedListRef = createRef<List>()


export function useTransactionListController(props: TransactionListProps) {

	const items = useStoreState(_ => _.transactions.filteredItems)

	const [isUpcomingOpen, setIsUpcomingOpen] = useState(false)

	const upcomingItemsByDates = useMemo(() => {
		return DateUtils.groupByDate(items.filter(_ => _.isUpcoming), (_) => _.date, { sort: true });
	}, [items])

	const upcomingTransactionsCount = useMemo(() => {
		return upcomingItemsByDates.reduce((sum, group) => {
			return sum + group.items.length
		}, 0)
	}, [upcomingItemsByDates])

	const itemsByDates = useMemo(() => {
		return DateUtils.groupByDate(items.filter(_ => !_.isUpcoming), (_) => _.date, { sort: true });
	}, [items])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	const [, setCreateMenuOpen] = useTransactionCreatorDrawerOpenState()

	const handleCreate = useCallback(() => {
		setCreateMenuOpen(true)
	}, [setCreateMenuOpen])

	// Recalculate virtualized list row heights each time the 
	// props change
	useEffect(() => {
		const virtualizedList = virtualizedListRef.current
		if (virtualizedList) {
			virtualizedList.recomputeRowHeights()
		}
	}, [props, itemsByDates, isUpcomingOpen])

	// Calculates height of date group
	function calculateDateGroupHeight(dateGroup: Unwrap<typeof itemsByDates>) {
		// Header		40 px
		// Elements	80 px * #elements
		return dateGroup.items.length * 80 + 40
	}

	// Calculates row heights
	function calculateRowHeight(index: number) {
		const fixedSpacing4 = Number(theme.fixed_spacing_4.replace(/\D/g, ""))

		// Index 0 is reserved for upcoming items element
		if (index === 0) {
			const handleHeight = 54.4
			const paddingTop = fixedSpacing4
			const paddingBottom = 0

			if (!upcomingTransactionsCount) {
				return 0
			} else if (isUpcomingOpen) {
				const upcomingDateGroupHeights = upcomingItemsByDates
					.reduce((height, group) => height + calculateDateGroupHeight(group), 0)
				return handleHeight + paddingBottom + paddingTop +
					upcomingDateGroupHeights
			} else {
				return handleHeight
			}
		}

		// Indices 1 to n+1 are reserved for date groups, indexed
		// from 0 to n (i)
		const padding = index === 1 ? fixedSpacing4 : 0
		const height = calculateDateGroupHeight(itemsByDates[index - 1])
		return height + padding
	}

	return {
		itemsByDates,
		upcomingItemsByDates,
		upcomingTransactionsCount,
		hasUpcomingItems: !!upcomingTransactionsCount,
		rowCount: itemsByDates.length + upcomingItemsByDates.length > 0
			? itemsByDates.length + 1
			: 0,
		showSkeletons,
		handleCreate,
		isUpcomingOpen,
		handleOpenUpcomingToggle() {
			setIsUpcomingOpen(_ => !_)
		},
		virtualizedListRef,
		calculateRowHeight
	}

}