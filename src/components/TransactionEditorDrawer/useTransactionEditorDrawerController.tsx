import { useEffect, useMemo } from "react"
import { useTransactionEditorDrawerVariableOpenState } from "../../hooks/componentStates/useTransactionEditorDrawerVariableOpenState"
import { useStoreState } from "../../store"
import { TransactionEditorDrawerProps } from "./TransactionEditorDrawer"

export function useTransactionEditorDrawerController(props: TransactionEditorDrawerProps) {

	const [value, setValue] = useTransactionEditorDrawerVariableOpenState()

	const items = useStoreState(_ => _.transactions.items)

	/**
	 * Find the item which the state corresponds to
	 */
	const selectedItem = useMemo(() => {
		return items.find(_ => _.id === value)
	}, [items, value])

	/**
	 * Automatically close the state if the state corresponds to an item
	 * which does not exist.
	 */
	useEffect(() => {
		if (value && !selectedItem) {
			setValue(null)
		}
	}, [selectedItem, value, setValue])

	return {
		selectedItem,
		onOpen: (id: string) => setValue(id),
		onClose: () => setValue(null),
	}
}