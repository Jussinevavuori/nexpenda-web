import { useCallback, useEffect, useMemo, useRef } from "react"
import { Transaction } from "../../classes/Transaction"
import { useTransactionContextMenu } from "../../contexts/TransactionContextMenu.context"
import { useIsSearchOpen } from "../../hooks/application/useIsSearchOpen"
import { useStoreActions, useStoreState } from "../../store"
import { DataUtils } from "../../utils/DataUtils/DataUtils"
import { useTransactionEditorDrawerVariableOpenState } from "../TransactionEditorDrawer/useTransactionEditorDrawerController"
import { TransactionContextMenuProps } from "./TransactionContextMenu"


export function useTransactionContextMenuController(props: TransactionContextMenuProps) {

	const selection = useStoreState(_ => _.selection.selection)
	const filteredTransactions = useStoreState(_ => _.transactions.filteredItems)

	const deselectAll = useStoreActions(_ => _.selection.deselectAll)
	const selectAll = useStoreActions(_ => _.selection.selectAll)
	const select = useStoreActions(_ => _.selection.select)
	const deselect = useStoreActions(_ => _.selection.deselect)

	const [, setEditor] = useTransactionEditorDrawerVariableOpenState()

	const menu = useTransactionContextMenu()

	const latestTransaction = useRef<Transaction | undefined>()
	useEffect(() => {
		if (menu.transaction) {
			latestTransaction.current = menu.transaction
		}
	}, [menu])

	/**
	 * Handle close
	 */
	const handleClose = useCallback(() => {
		menu.setPosition(undefined)
		menu.setTransaction(undefined)
	}, [menu])

	/**
	 * Selected
	 */
	const isSelected = useMemo(() => {
		return selection.some(t => {
			return t.id === menu.transaction?.id
		})
	}, [menu, selection])

	/**
	 * Select toggle
	 */
	const handleSelectToggle = useCallback(() => {
		if (menu.transaction) {
			if (isSelected) {
				deselect(menu.transaction.id)
			} else {
				select(menu.transaction.id)
			}
		}
		handleClose()
	}, [handleClose, menu, select, deselect, isSelected])

	/**
	 * All selected
	 */
	const isAllSelected = useMemo(() => {
		return DataUtils.compareArrays(
			filteredTransactions.map(_ => _.id),
			selection.map(_ => _.id),
		)
	}, [filteredTransactions, selection])

	/**
	 * Select all toggle
	 */
	const handleSelectAllToggle = useCallback(() => {
		if (isAllSelected) {
			deselectAll()
		} else {
			selectAll(filteredTransactions.map(_ => _.id))
		}
		handleClose()
	}, [handleClose, deselectAll, selectAll, isAllSelected, filteredTransactions])

	/**
	 * Editing
	 */
	const handleEdit = useCallback(() => {
		if (menu.transaction) {
			setEditor(menu.transaction.id)
		}
		handleClose()
	}, [handleClose, menu, setEditor])

	/**
	 * Deletion
	 */
	const deleteTransactions = useStoreActions(_ => _.transactions.massDeleteTransactions)
	const handleDelete = useCallback(() => {
		if (menu.transaction) {
			deleteTransactions([menu.transaction.id])
		}
		handleClose()
	}, [handleClose, deleteTransactions, menu])

	/**
	 * Filtering by category
	 */
	const smartSearch = useStoreState(_ => _.transactions.smartSearch)
	const setSearch = useStoreActions(_ => _.transactions.setSearchTerm)
	const { 1: setIsSearchOpen } = useIsSearchOpen()

	const isCategoryFilterToggledOn = useMemo(() => {
		return smartSearch.matchCategories.some(c => {
			return c.id === menu.transaction?.category.id
		})
	}, [smartSearch, menu])

	const handleToggleCategoryFilter = useCallback(() => {

		// Ensure transaction selected
		const transaction = menu.transaction
		if (!transaction) return

		// If category included, remove it, else toggle it on
		const categoryAlreadyIncluded = smartSearch.matchCategories.some(_ => _.id === transaction.category.id)

		// Get new categories by excluding or adding the category
		const categories = categoryAlreadyIncluded
			? smartSearch.matchCategories.filter(_ => _.id !== transaction.category.id)
			: smartSearch.matchCategories.concat(transaction.category)

		// If added category, open search
		if (!categoryAlreadyIncluded) {
			setIsSearchOpen(true)
		}

		// Get new search
		const newSearch = smartSearch.getSearchTermWithCategory(categories)
		setSearch(newSearch)

		// Close
		handleClose()
	}, [handleClose, menu, smartSearch, setSearch, setIsSearchOpen])


	return {
		position: menu.position,
		transaction: menu.transaction,
		latestTransaction: menu.transaction ?? latestTransaction.current,

		isAllSelected,
		isSelected,
		isCategoryFilterToggledOn,

		onSelectAllToggle: handleSelectAllToggle,
		onSelectToggle: handleSelectToggle,

		onDelete: handleDelete,
		onEdit: handleEdit,

		onToggleCategoryFilter: handleToggleCategoryFilter,

		onClose: handleClose,
	}
}