import { DashboardPanelProps } from "./DashboardPanel";
import { useCallback, useMemo } from "react";
import { useStoreState, useStoreActions } from "../../../store";
import { useTransactionEditorOpenState } from "../../../hooks/componentStates/useTransactionEditorOpenState";
import { useIsSearchOpen } from "../../../hooks/application/useIsSearchOpen";
import { compareArrays } from "../../../lib/Utilities/compareArrays";

export function useDashboardPanelController(props: DashboardPanelProps) {
  // Is the search open
  const { isOpen: isSearchOpen } = useIsSearchOpen();

  // Selection state
  const selection = useStoreState((_) => _.selection.selection);
  const isSelectionActive = useStoreState((_) => _.selection.selectionActive);

  // Deselect all functionality
  const deselectAll = useStoreActions((_) => _.selection.deselectAll);
  const handleDeselectAll = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  // Select all functionality
  const filteredTransactions = useStoreState(
    (_) => _.transactions.filteredItems
  );
  const selectAll = useStoreActions((_) => _.selection.selectAll);
  const handleSelectAll = useCallback(() => {
    selectAll(filteredTransactions.map((_) => _.id));
  }, [selectAll, filteredTransactions]);

  // Are all selected
  const allSelected = useMemo(() => {
    return compareArrays(
      filteredTransactions.map((_) => _.id),
      selection.map((_) => _.id)
    );
  }, [filteredTransactions, selection]);

  // Deletion functionaliyy
  const deleteTransactions = useStoreActions(
    (_) => _.transactions.massDeleteTransactions
  );
  const handleDelete = useCallback(async () => {
    deleteTransactions(selection.map((_) => _.id));
    deselectAll();
  }, [deleteTransactions, selection, deselectAll]);

  // Edit functionality
  const { handleOpen: handleOpenEditor } = useTransactionEditorOpenState();
  const handleEdit = useCallback(() => {
    if (selection.length === 1) {
      handleOpenEditor(selection[0]);
      deselectAll();
    }
  }, [selection, handleOpenEditor, deselectAll]);

  return {
    selection,
    allSelected,
    isSelectionActive,
    handleSelectAll,
    handleDeselectAll,
    handleEdit,
    handleDelete,
    isSearchOpen,
  };
}
