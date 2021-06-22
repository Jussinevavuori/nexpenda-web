import { useMemo, useCallback } from "react";
import { MoneyAmount } from "../../lib/Money/MoneyAmount";
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

	const selection = useStoreState(_ => _.selection.selection)
	const selectedTransaction = useMemo(() => {
		return selection.length === 1 ? selection[0] : undefined
	}, [selection])

	const selectionLength = useMemo(() => {
		return selection.length
	}, [selection])

	const selectionTotalAmount = useMemo(() => {
		if (selection.length > 0) {
			return MoneyAmount.sum(selection.map(_ => _.amount))
		}
	}, [selection])

	return {
		transactionsCount,
		transactionsTotal,
		intervalLabel,
		isDesktopLayout,
		showCreateTransactionForm,
		handleTransactionFormClose,
		selectedTransaction,
		selectionTotalAmount,
		selectionLength,
	}

}