import { useCallback } from "react";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useTransactionCreatorOpenState } from "../componentStates/useTransactionCreatorOpenState";
import { useShortcut } from "./useShortcut";

export function useCreateTransactionShortcut() {
  const isApplicationActive = useIsApplicationActive();

  const { handleOpen, handleClose } = useTransactionCreatorOpenState();

  const openCreateHandler = useCallback(() => {
    if (!isApplicationActive) return;
    handleOpen();
  }, [isApplicationActive, handleOpen]);

  const hideCreateHandler = useCallback(() => {
    if (!isApplicationActive) return;
    handleClose();
  }, [isApplicationActive, handleClose]);

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
