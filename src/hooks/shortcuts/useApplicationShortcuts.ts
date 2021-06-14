import { useCloseFormsShortcut } from "./useCloseFormsShortcut";
import { useCopyTransactionShortcut } from "./useCopyTransactionShortcut";
import { useCreateTransactionShortcut } from "./useCreateTransactionShortcut";
import { useDeleteTransactionsShortcut } from "./useDeleteTransactionsShortcut";
import { useEditTransactionShortcut } from "./useEditTransactionShortcut";
import { useSelectShortcuts } from "./useSelectShortcuts";
import { useSelectTabShortcuts } from "./useSelectTabShortcuts";
import { useToggleSidebarShortcut } from "./useToggleSidebarShortcut";

export function useApplicationShortcuts() {
  useCreateTransactionShortcut();
  useEditTransactionShortcut();
  useCloseFormsShortcut();
  useDeleteTransactionsShortcut();
  useSelectShortcuts();
  useSelectTabShortcuts();
  useToggleSidebarShortcut();
  useCopyTransactionShortcut();
}
