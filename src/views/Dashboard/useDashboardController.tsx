import { useMemo, useCallback } from "react";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useMdMedia } from "../../hooks/useMedia";

export function useDashboardController() {

	const isDesktopLayout = useMdMedia()

	const [transactionFormOpen, setTransactionFormOpen] = useTransactionCreatorDrawerOpenState()

	const showTransactionForm = useMemo(() => {
		return isDesktopLayout && transactionFormOpen
	}, [isDesktopLayout, transactionFormOpen])

	const handleTransactionFormClose = useCallback(() => {
		setTransactionFormOpen(true)
	}, [setTransactionFormOpen])

	return {
		isDesktopLayout,
		showTransactionForm,
		handleTransactionFormClose
	}

}