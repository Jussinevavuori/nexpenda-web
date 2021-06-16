import { useTransactionCreatorOpenState } from "../../hooks/componentStates/useTransactionCreatorOpenState"
import { TransactionCreatorDrawerProps } from "./TransactionCreatorDrawer"


export function useTransactionCreatorDrawerController(props: TransactionCreatorDrawerProps) {

	const { isOpen, handleOpen, handleClose } = useTransactionCreatorOpenState()

	return {
		isOpen,
		onOpen: () => handleOpen(),
		onClose: () => handleClose(),
	}
}