import { DashboardActionsProps } from "./DashboardActions";
import { useCallback, useMemo, useState } from "react";
import { useStoreState, useStoreActions } from "../../../store";
import { DataUtils } from "../../../utils/DataUtils/DataUtils";
import { useBooleanQueryState } from "../../../hooks/state/useBooleanQueryState";
import { TransactionSpreadsheet } from "../../../utils/FileIO/TransactionSpreadsheet";
import { useMenuAnchorState } from "../../../hooks/state/useMenuAnchorState";
import { useTransactionCreatorDrawerOpenState } from "../../../hooks/componentStates/useTransactionCreatorDrawerOpenState";
import { useTransactionEditorDrawerVariableOpenState } from "../../../hooks/componentStates/useTransactionEditorDrawerVariableOpenState";
import { ComponentState } from "../../../hooks/componentStates/ComponentState";

export function useDashboardActionsController(props: DashboardActionsProps) {
  /**
   * More menu
   */
  const moreMenu = useMenuAnchorState();
  const closeMoreMenu = moreMenu.handleMenuClose;

  /**
   * Search open
   */
  const [isSearchOpen] = useBooleanQueryState(
    ComponentState.keys.Search,
    "replace",
    "open"
  );

  /**
   * Selection
   */
  const selection = useStoreState((_) => _.selection.selection);

  /**
   * Is the selection active
   */
  const isSelectionActive = useStoreState((_) => _.selection.selectionActive);

  /**
   * Deselect all
   */
  const deselectAll = useStoreActions((_) => _.selection.deselectAll);
  const handleDeselectAll = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  /**
   * Select all
   */
  const filteredTransactions = useStoreState(
    (_) => _.transactions.filteredItems
  );
  const selectAll = useStoreActions((_) => _.selection.selectAll);
  const handleSelectAll = useCallback(() => {
    selectAll(filteredTransactions.map((_) => _.id));
  }, [selectAll, filteredTransactions]);

  /**
   * All selected
   */
  const allSelected = useMemo(() => {
    return DataUtils.compareArrays(
      filteredTransactions.map((_) => _.id),
      selection.map((_) => _.id)
    );
  }, [filteredTransactions, selection]);

  /**
   * Deletion
   */
  const deleteTransactions = useStoreActions(
    (_) => _.transactions.massDeleteTransactions
  );
  const handleDelete = useCallback(async () => {
    deleteTransactions(selection.map((_) => _.id));
    deselectAll();
  }, [deleteTransactions, selection, deselectAll]);

  /**
   * Downloading
   */
  const [isDownloading, setIsDownloading] = useState(false);
  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    const spreadsheet = new TransactionSpreadsheet(selection);
    spreadsheet.downloadFile();
    setIsDownloading(false);
    closeMoreMenu();
  }, [setIsDownloading, selection, closeMoreMenu]);

  /**
   * Editor drawer
   */
  const [, setEditor] = useTransactionEditorDrawerVariableOpenState();
  const handleEdit = useCallback(() => {
    if (selection.length === 1) {
      setEditor(selection[0].id);
      deselectAll();
    }
  }, [selection, setEditor, deselectAll]);

  /**
   * Create transaction drawer
   */
  const [createDrawerOpen, setCreateDrawerOpen] =
    useTransactionCreatorDrawerOpenState();
  const handleCreate = useCallback(() => {
    setCreateDrawerOpen(!createDrawerOpen);
  }, [createDrawerOpen, setCreateDrawerOpen]);

  return {
    moreMenu,
    selection,
    allSelected,
    isSelectionActive,
    createDrawerOpen,
    handleSelectAll,
    handleDeselectAll,
    handleEdit,
    handleDelete,
    handleCreate,
    handleDownload,
    isDownloading,
    isSearchOpen,
  };
}
