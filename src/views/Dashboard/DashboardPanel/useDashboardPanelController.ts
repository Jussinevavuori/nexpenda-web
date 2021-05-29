import { DashboardPanelProps } from "./DashboardPanel";
import { useCallback, useMemo } from "react";
import { useStoreState, useStoreActions } from "../../../store";
import { DataUtils } from "../../../utils/DataUtils/DataUtils";
import { useBooleanQueryState } from "../../../hooks/state/useBooleanQueryState";
import { useTransactionEditorDrawerVariableOpenState } from "../../../hooks/componentStates/useTransactionEditorDrawerVariableOpenState";
import { ComponentState } from "../../../hooks/componentStates/ComponentState";

export function useDashboardPanelController(props: DashboardPanelProps) {
  // Is the search open
  const [isSearchOpen] = useBooleanQueryState(
    ComponentState.keys.Search,
    "replace",
    "open"
  );

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
    return DataUtils.compareArrays(
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
  const [, setEditor] = useTransactionEditorDrawerVariableOpenState();
  const handleEdit = useCallback(() => {
    if (selection.length === 1) {
      setEditor(selection[0].id);
      deselectAll();
    }
  }, [selection, setEditor, deselectAll]);

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
