import { useCallback } from "react";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useShortcut } from "./useShortcut";

export function useCreateTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();

  const [, setIsOpen] = useTransactionCreatorDrawerOpenState();

  const openCreateHandler = useCallback(() => {
    if (!isApplicationActive) return;
    setIsOpen(true);
  }, [isApplicationActive, setIsOpen]);

  const hideCreateHandler = useCallback(() => {
    if (!isApplicationActive) return;
    setIsOpen(false);
  }, [isApplicationActive, setIsOpen]);

  useShortcut(
    {
      key: "N",
      shift: true,
    },
    openCreateHandler
  );
  useShortcut(
    {
      key: "N",
      shift: true,
      alt: true,
      enableForInputs: true,
    },
    hideCreateHandler
  );
}
