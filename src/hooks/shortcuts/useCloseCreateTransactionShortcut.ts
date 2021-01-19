import { useCallback } from "react";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useShortcut } from "./useShortcut";

export function useCloseCreateTransactionShortcut() {
  const [, setOpen] = useTransactionCreatorDrawerOpenState();

  const handler = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useShortcut({ key: "Escape", enableForInputs: true }, handler);
}
