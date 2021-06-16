import React, { useCallback, useMemo } from "react";
import { useRegisteredHTMLElement } from "../application/useRegisteredHTMLElement";
import {
  OpenQueryStateOptions,
  useOpenQueryState,
  UseOpenQueryStateOptions,
} from "./useOpenQueryState";

export type UseOpenMenuQueryStateOptions = UseOpenQueryStateOptions & {};

export function useOpenMenuQueryState(
  key: string,
  options?: UseOpenMenuQueryStateOptions
) {
  // Get query state for storing the open/closed state information
  const {
    isOpen,
    handleOpen: handleStateOpen,
    handleClose: handleStateClose,
  } = useOpenQueryState(key, options);

  // Get the anchor element using the registered HTML element context
  // to access anchor element from anywhere where this hook is called
  const [anchorEl, setAnchorEl] = useRegisteredHTMLElement(key);

  // Open with mouse click with this method
  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, ops?: OpenQueryStateOptions) => {
      handleStateOpen(ops);
      setAnchorEl(e.currentTarget);
    },
    [handleStateOpen, setAnchorEl]
  );

  // Close programmatically with this method
  const handleClose = useCallback(() => {
    handleStateClose();
  }, [handleStateClose]);

  // Return all properties with memorized reference
  return useMemo(
    () => ({
      isOpen: isOpen && !!anchorEl,
      anchorEl,
      handleOpen,
      handleClose,
    }),
    [isOpen, anchorEl, handleOpen, handleClose]
  );
}
