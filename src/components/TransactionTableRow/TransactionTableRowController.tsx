import React, { useCallback, useMemo } from "react"
import { Transaction } from "../../classes/Transaction"
import { useStoreActions, useStoreState } from "../../store"
import { TransactionTableRowView } from "./TransactionTableRowView"

export type TransactionTableRowProps = {
	transaction: Transaction;
}

export function TransactionTableRow(props: TransactionTableRowProps) {

	/**
	 * Handle category select and deselect
	 */
	const categoryFilter = useStoreState(_ => _.filters.categories)
	const selectCategoryFilter = useStoreActions(_ => _.filters.selectCategory)
	const deselectCategoryFilter = useStoreActions(_ => _.filters.deselectCategory)
	const handleCategorySelect = useCallback(() => {
		const category = props.transaction.category
		if (categoryFilter.includes(category)) {
			deselectCategoryFilter(category)
		} else {
			selectCategoryFilter(category)
		}
	}, [categoryFilter, deselectCategoryFilter, selectCategoryFilter, props.transaction])

	/**
	 * Selected
	 */
	const selection = useStoreState(_ => _.selection.selection)
	const selected = useMemo(() => {
		return selection.some(_ => _.id === props.transaction.id)
	}, [props.transaction, selection])

	/**
	 * Handle selection
	 */
	const select = useStoreActions(_ => _.selection.select)
	const handleSelect = useCallback(() => {
		select(props.transaction.id)
	}, [props.transaction, select])

	/**
	 * Handle deselection
	 */
	const deselect = useStoreActions(_ => _.selection.deselect)
	const handleDeselect = useCallback(() => {
		deselect(props.transaction.id)
	}, [props.transaction, deselect])

	/**
	 * Selection active
	 */
	const selectionActive = useStoreState(_ => _.selection.selectionActive)

	/**
	 * Handle click
	 */
	const handleClick = useCallback((e: React.MouseEvent) => {
		if (selected) {
			handleDeselect()
		} else {
			handleSelect()
		}
	}, [handleDeselect, handleSelect, selected])

	return <TransactionTableRowView
		transaction={props.transaction}

		onSelectCategory={handleCategorySelect}

		onClick={handleClick}

		selected={selected}
		selectionActive={selectionActive}
		onSelect={handleSelect}
		onDeselect={handleDeselect}
	/>
}