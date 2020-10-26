import React, { useEffect, useMemo } from "react"
import { useVariableHashOpenState } from "../../hooks/useVariableHashOpenState"
import { useStoreState } from "../../store"
import { TransactionEditorDrawerView } from "./TransactionEditorDrawerView"

export type TransactionEditorDrawerProps = {

}

export const TransactionEditorDrawerOpenHash = `edit`

export function useTransactionEditorDrawerVariableOpenState() {
	return useVariableHashOpenState(TransactionEditorDrawerOpenHash)
}

export function TransactionEditorDrawer(props: TransactionEditorDrawerProps) {

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

	return <TransactionEditorDrawerView
		selectedItem={selectedItem}
		onOpen={(id) => setValue(id)}
		onClose={() => setValue(null)}
	/>
}