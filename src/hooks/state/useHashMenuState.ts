import { useCallback } from "react";
import { useRegisteredHTMLElement } from "../application/useRegisteredHTMLElement";
import { useHashOpenState } from "./useHashOpenState";

/**
 * Helper function to handle a menu's state which uses hash open state.
 * Takes in same parameters as the hash open state function.
 */
export function useHashMenuState(hash: string) {
  // Open and anchor el state
  const [isOpen, setIsOpen] = useHashOpenState(hash);
  const [anchorEl, setAnchorEl] = useRegisteredHTMLElement(hash);

  // Open function
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setIsOpen(true);
      setAnchorEl(e.currentTarget);
    },
    [setIsOpen, setAnchorEl]
  );

  // Close function
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setAnchorEl(null);
  }, [setIsOpen, setAnchorEl]);

  return {
    isOpen,
    setIsOpen,
    setAnchorEl,
    anchorEl,
    handleOpen,
    handleClose,
  };
}
