import { useCallback } from "react";
import { useRegisteredHTMLElement } from "../application/useRegisteredHTMLElement";
import { useBooleanQueryState } from "./useBooleanQueryState";

/**
 * Helper function to handle a menu's state which uses hash open state.
 * Takes in same parameters as the hash open state function.
 */
export function useQueryMenuState(key: string, method: "push" | "replace") {
  // Open and anchor el state
  const [isOpen, setIsOpen] = useBooleanQueryState(key, method);
  const [anchorEl, setAnchorEl] = useRegisteredHTMLElement(key);

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
