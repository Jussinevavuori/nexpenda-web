import { useCallback } from "react";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useIsApplicationActive } from "../useIsApplicationActive";
import { useShortcut } from "./useShortcut";

export function useCreateTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();

  const [, setOpen] = useTransactionCreatorDrawerOpenState();

  const handler = useCallback(() => {
    if (isApplicationActive) {
      setOpen(true);
    }
  }, [isApplicationActive, setOpen]);

  useShortcut({ key: "N", shift: true }, handler);
}
