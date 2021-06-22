import { DashboardActionsProps } from "./DashboardActions";
import { useCallback, useMemo, useState } from "react";
import { useStoreState, useStoreActions } from "../../../store";
import { TransactionSpreadsheet } from "../../../lib/FileIO/TransactionSpreadsheet";
import { useMenuAnchorState } from "../../../hooks/state/useMenuAnchorState";
import { useTransactionCreatorOpenState } from "../../../hooks/componentStates/useTransactionCreatorOpenState";
import { useIsSearchOpen } from "../../../hooks/application/useIsSearchOpen";
import { useTransactionEditorOpenState } from "../../../hooks/componentStates/useTransactionEditorOpenState";
import { compareArrays } from "../../../lib/Utilities/compareArrays";

export function useDashboardActionsController(props: DashboardActionsProps) {
  /**
   * More menu
   */
  const moreMenu = useMenuAnchorState();
  const closeMoreMenu = moreMenu.handleMenuClose;

  /**
   * Search open
   */
  const { isOpen: isSearchOpen } = useIsSearchOpen();

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
    return compareArrays(
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
  const { handleOpen: handleOpenEditor } = useTransactionEditorOpenState();
  const handleEdit = useCallback(() => {
    if (selection.length === 1) {
      handleOpenEditor(selection[0]);
      deselectAll();
    }
  }, [selection, handleOpenEditor, deselectAll]);

  /**
   * Create transaction drawer
   */
  const { isOpen: createDrawerOpen, handleToggle: handleCreateDrawerToggle } =
    useTransactionCreatorOpenState();

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
    handleCreate: handleCreateDrawerToggle,
    handleDownload,
    isDownloading,
    isSearchOpen,
  };
}
