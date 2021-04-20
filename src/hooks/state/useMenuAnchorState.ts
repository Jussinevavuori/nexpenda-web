import { useCallback, useMemo, useState } from "react";

export function useMenuAnchorState() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const isMenuOpen = useMemo(() => !!anchorEl, [anchorEl]);

  return {
    anchorEl,
    setAnchorEl,
    isMenuOpen,
    handleMenuClose,
    handleMenuOpen,
  };
}
