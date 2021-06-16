import { useCallback } from "react";

export function useOpenStateWrapper(state: [boolean, (t: boolean) => void]) {
  const [isOpen, setIsOpen] = state;

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  return {
    isOpen,
    setIsOpen,
    handleOpen,
    handleClose,
    handleToggle,
  };
}
