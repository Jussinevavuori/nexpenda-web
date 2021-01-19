import { useCloseCreateTransactionShortcut } from "./useCloseCreateTransactionShortcut";
import { useCreateTransactionShortcut } from "./useCreateTransactionShortcut";

export function useApplicationShortcuts() {
  useCreateTransactionShortcut();
  useCloseCreateTransactionShortcut();
}
