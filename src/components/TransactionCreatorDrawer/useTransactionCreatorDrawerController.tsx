import { useHashOpenState } from "../../hooks/useHashOpenState"
import { TransactionCreatorDrawerProps } from "./TransactionCreatorDrawer"

export const TransactionCreatorDrawerOpenHash = "create"

export function useTransactionCreatorDrawerOpenState() {
	return useHashOpenState(TransactionCreatorDrawerOpenHash)
}

export function useTransactionCreatorDrawerController(props: TransactionCreatorDrawerProps) {

	const [open, setOpen] = useTransactionCreatorDrawerOpenState()

	return {
		open,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
	}
}