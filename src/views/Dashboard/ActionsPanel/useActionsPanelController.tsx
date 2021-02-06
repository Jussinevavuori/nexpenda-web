import { useCallback, useMemo } from "react"
import { ActionsPanelProps } from "./ActionsPanel"
import { useStoreState, useStoreActions } from "../../../store"
import { DataUtils } from "../../../utils/DataUtils/DataUtils"
import { useTransactionEditorDrawerVariableOpenState } from "../../../components/TransactionEditorDrawer/useTransactionEditorDrawerController"
import { useTransactionCreatorDrawerOpenState } from "../../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController"
import { useBooleanQueryState } from "../../../hooks/state/useBooleanQueryState"

export function useActionsPanelController(props: ActionsPanelProps) {

	/**
	 * Search open
	 */
	const [isSearchOpen] = useBooleanQueryState("search", "replace", "open")

	/**
	 * Selection
	 */
	const selection = useStoreState(_ => _.selection.selection)

	/**
	 * Is the selection active
	 */
	const isSelectionActive = useStoreState(_ => _.selection.selectionActive)

	/**
	 * Deselect all
	 */
	const deselectAll = useStoreActions(_ => _.selection.deselectAll)
	const handleDeselectAll = useCallback(() => {
		deselectAll()
	}, [deselectAll])

	/**
	 * Select all
	 */
	const filteredTransactions = useStoreState(_ => _.transactions.filteredItems)
	const selectAll = useStoreActions(_ => _.selection.selectAll)
	const handleSelectAll = useCallback(() => {
		selectAll(filteredTransactions.map(_ => _.id))
	}, [selectAll, filteredTransactions])

	/**
	 * All selected
	 */
	const allSelected = useMemo(() => {
		return DataUtils.compareArrays(
			filteredTransactions.map(_ => _.id),
			selection.map(_ => _.id),
		)
	}, [filteredTransactions, selection])

	/**
	 * Deletion
	 */
	const deleteTransactions = useStoreActions(_ => _.transactions.deleteTransactions)
	const handleDelete = useCallback(async () => {
		deleteTransactions(selection.map(_ => _.id))
		deselectAll()
	}, [deleteTransactions, selection, deselectAll])

	/**
	 * Editor drawer
	 */
	const [, setEditor] = useTransactionEditorDrawerVariableOpenState()
	const handleEdit = useCallback(() => {
		if (selection.length === 1) {
			setEditor(selection[0].id)
			deselectAll()
		}
	}, [selection, setEditor, deselectAll])

	/**
	 * Create transaction drawer
	 */
	const [createDrawerOpen, setCreateDrawerOpen] = useTransactionCreatorDrawerOpenState()
	const handleCreate = useCallback(() => {
		setCreateDrawerOpen(!createDrawerOpen)
	}, [createDrawerOpen, setCreateDrawerOpen])

	return {
		selection,
		allSelected,
		isSelectionActive,
		createDrawerOpen,
		handleSelectAll,
		handleDeselectAll,
		handleEdit,
		handleDelete,
		handleCreate,
		isSearchOpen
	}
}