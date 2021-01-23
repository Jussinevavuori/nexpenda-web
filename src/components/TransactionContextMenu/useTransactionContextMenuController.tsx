import { useCallback, useMemo } from "react"
import { useTransactionContextMenu } from "../../contexts/TransactionContextMenu.context"
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
	const handleDelete = useCallback(() => {
		handleClose()
	}, [handleClose])

	return {
		position: menu.position,
		transaction: menu.transaction,

		isAllSelected: isAllSelected,
		isSelected: isSelected,

		onSelectAllToggle: handleSelectAllToggle,
		onSelectToggle: handleSelectToggle,

		onDelete: handleDelete,
		onEdit: handleEdit,

		onClose: handleClose,
	}
}