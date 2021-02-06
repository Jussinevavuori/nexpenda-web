import { useBooleanQueryState } from "../../hooks/useBooleanQueryState"
import { TransactionCreatorDrawerProps } from "./TransactionCreatorDrawer"

export const TransactionCreatorDrawerOpenQuery = "create"

export function useTransactionCreatorDrawerOpenState() {
	return useBooleanQueryState(TransactionCreatorDrawerOpenQuery, "push", "open")
}

export function useTransactionCreatorDrawerController(props: TransactionCreatorDrawerProps) {

	const [open, setOpen] = useTransactionCreatorDrawerOpenState()

	return {
		open,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
	}
}