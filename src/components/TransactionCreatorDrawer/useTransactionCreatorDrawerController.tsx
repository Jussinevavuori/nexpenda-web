import { useTransactionCreatorDrawerOpenState } from "../../hooks/componentStates/useTransactionCreatorDrawerOpenState"
import { TransactionCreatorDrawerProps } from "./TransactionCreatorDrawer"


export function useTransactionCreatorDrawerController(props: TransactionCreatorDrawerProps) {

	const [open, setOpen] = useTransactionCreatorDrawerOpenState()

	return {
		open,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
	}
}