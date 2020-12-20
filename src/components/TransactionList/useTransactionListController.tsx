import { useStoreState } from "../../store"
import { TransactionListProps } from "./TransactionList"

export function useTransactionListController(props: TransactionListProps) {

	const itemsByDates = useStoreState(_ => _.transactions.filtered.itemsByDates)

	const initializedUser = useStoreState(_ => _.auth.initialized)
	const initializedItems = useStoreState(_ => _.transactions.initialized)
	const shouldShowSkeletons = !initializedItems || !initializedUser
	const showSkeletons = props.showSkeletons && shouldShowSkeletons


	return {
		itemsByDates,
		showSkeletons,
	}

}