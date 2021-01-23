import { useMemo, useCallback } from "react"
import { useStoreState } from "../../store"
import { DateUtils } from "../../utils/DateUtils/DateUtils"
import { useTransactionCreatorDrawerOpenState } from "../TransactionCreatorDrawer/useTransactionCreatorDrawerController"
import { TransactionListProps } from "./TransactionList"

export function useTransactionListController(props: TransactionListProps) {

	const items = useStoreState(_ => _.transactions.filteredItems)

	const itemsByDates = useMemo(() => {
		return DateUtils.groupByDate(items, (_) => _.date, { sort: true });
	}, [items])

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons

	const [, setCreateMenuOpen] = useTransactionCreatorDrawerOpenState()

	const handleCreate = useCallback(() => {
		setCreateMenuOpen(true)
	}, [setCreateMenuOpen])


	return {
		itemsByDates,
		showSkeletons,
		handleCreate
	}

}