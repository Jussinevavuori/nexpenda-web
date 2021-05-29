import { useMemo, useCallback } from "react";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { useTransactionCreatorDrawerOpenState } from "../../hooks/componentStates/useTransactionCreatorDrawerOpenState";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { useStoreState } from "../../store";

export function useDashboardController() {

	const transactions = useStoreState(_ => _.transactions.filteredItems)
	const intervalLabel = useStoreState(_ => _.interval.smartDisplayString)
	const transactionsCount = useMemo(() => {
		return transactions.length
	}, [transactions])
	const transactionsTotal = useMemo(() => {
		return MoneyAmount.sum(transactions.map(_ => _.amount))
	}, [transactions])

	const isDesktopLayout = useMdMedia()

	const [transactionCreatorFormOpen, setTransactionCreatorFormOpen] = useTransactionCreatorDrawerOpenState()

	const showCreateTransactionForm = useMemo(() => {
		return isDesktopLayout && transactionCreatorFormOpen
	}, [isDesktopLayout, transactionCreatorFormOpen])

	const handleTransactionFormClose = useCallback(() => {
		setTransactionCreatorFormOpen(false)
	}, [setTransactionCreatorFormOpen])

	return {
		transactionsCount,
		transactionsTotal,
		intervalLabel,
		isDesktopLayout,
		showCreateTransactionForm,
		handleTransactionFormClose,
	}

}