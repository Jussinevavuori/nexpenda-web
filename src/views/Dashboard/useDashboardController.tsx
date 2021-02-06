import { useMemo, useCallback } from "react";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useMdMedia } from "../../hooks/utils/useMedia";

export function useDashboardController() {

	const isDesktopLayout = useMdMedia()

	const [transactionCreatorFormOpen, setTransactionCreatorFormOpen] = useTransactionCreatorDrawerOpenState()

	const showCreateTransactionForm = useMemo(() => {
		return isDesktopLayout && transactionCreatorFormOpen
	}, [isDesktopLayout, transactionCreatorFormOpen])

	const handleTransactionFormClose = useCallback(() => {
		setTransactionCreatorFormOpen(false)
	}, [setTransactionCreatorFormOpen])

	return {
		isDesktopLayout,
		showCreateTransactionForm,
		handleTransactionFormClose,
	}

}