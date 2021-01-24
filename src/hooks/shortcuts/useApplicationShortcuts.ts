import { useCloseCreateTransactionShortcut } from "./useCloseCreateTransactionShortcut";
import { useCloseEditTransactionShortcut } from "./useCloseEditTransactionShortcut";
import { useCreateTransactionShortcut } from "./useCreateTransactionShortcut";

export function useApplicationShortcuts() {
  useCreateTransactionShortcut();
  useCloseCreateTransactionShortcut();
  useCloseEditTransactionShortcut();
}
