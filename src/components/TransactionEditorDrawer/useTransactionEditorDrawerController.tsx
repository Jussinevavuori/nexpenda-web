import { useTransactionEditorOpenState } from "../../hooks/componentStates/useTransactionEditorOpenState"
import { TransactionEditorDrawerProps } from "./TransactionEditorDrawer"

export function useTransactionEditorDrawerController(props: TransactionEditorDrawerProps) {

	const { openedTransaction, handleClose } = useTransactionEditorOpenState()

	return {
		selectedItem: openedTransaction,
		onClose: handleClose,
	}
}