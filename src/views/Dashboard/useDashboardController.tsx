import { useMemo, useCallback } from "react";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { useTransactionCreatorOpenState } from "../../hooks/componentStates/useTransactionCreatorOpenState";
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

	const { isOpen: isTransactionCreatorDrawerOpen, handleClose: handleTransactionCreatorClose } = useTransactionCreatorOpenState()

	const showCreateTransactionForm = useMemo(() => {
		return isDesktopLayout && isTransactionCreatorDrawerOpen
	}, [isDesktopLayout, isTransactionCreatorDrawerOpen])

	const handleTransactionFormClose = useCallback(() => {
		handleTransactionCreatorClose()
	}, [handleTransactionCreatorClose])

	return {
		transactionsCount,
		transactionsTotal,
		intervalLabel,
		isDesktopLayout,
		showCreateTransactionForm,
		handleTransactionFormClose,
	}

}