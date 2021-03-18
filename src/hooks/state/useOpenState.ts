import { useCallback, useState } from "react";

export function useOpenState(defaultState: boolean = false) {
  const [isOpen, setIsOpen] = useState(defaultState);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((_) => !_);
  }, [setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    handleOpen,
    handleClose,
    handleToggle,
  };
}
