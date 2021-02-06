import { useCallback } from "react";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useShortcut } from "./useShortcut";

export function useCreateTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();

  const [isOpen, setIsOpen] = useTransactionCreatorDrawerOpenState();

  const handler = useCallback(() => {
    if (isApplicationActive) {
      setIsOpen(!isOpen);
    }
  }, [isApplicationActive, isOpen, setIsOpen]);

  useShortcut({ key: "N", shift: true }, handler);
}
