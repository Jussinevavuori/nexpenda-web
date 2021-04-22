import { useCloseFormsShortcut } from "./useCloseFormsShortcut";
import { useCreateTransactionShortcut } from "./useCreateTransactionShortcut";
import { useDeleteTransactionsShortcut } from "./useDeleteTransactionsShortcut";
import { useEditTransactionShortcut } from "./useEditTransactionShortcut";
import { useSelectShortcuts } from "./useSelectShortcuts";
import { useSelectTabShortcuts } from "./useSelectTabShortcuts";

export function useApplicationShortcuts() {
  useCreateTransactionShortcut();
  useEditTransactionShortcut();
  useCloseFormsShortcut();
  useDeleteTransactionsShortcut();
  useSelectShortcuts();
  useSelectTabShortcuts();
}
