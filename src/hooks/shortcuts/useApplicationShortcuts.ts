import { useCloseFormsShortcut } from "./useCloseFormsShortcut";
import { useCreateTransactionShortcut } from "./useCreateTransactionShortcut";
import { useDeleteTransactionsShortcut } from "./useDeleteTransactionsShortcut";
import { useEditTransactionShortcut } from "./useEditTransactionShortcut";

export function useApplicationShortcuts() {
  useCreateTransactionShortcut();
  useEditTransactionShortcut();
  useCloseFormsShortcut();
  useDeleteTransactionsShortcut();
}
