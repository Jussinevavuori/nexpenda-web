import { useCallback } from "react";

export function useOpenStateWrapper(state: [boolean, (t: boolean) => void]) {
  const [isOpen, setIsOpen] = state;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    handleOpen,
    handleClose,
  };
}
