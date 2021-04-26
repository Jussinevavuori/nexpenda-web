import { useCallback } from "react";
import { useStoreActions } from "../../store";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useShortcut } from "./useShortcut";

export function useToggleSidebarShortcut() {
  const isApplicationActive = useIsApplicationActive();
  const toggleSidebar = useStoreActions((_) => _.sidebar.toggle);

  const handler = useCallback(() => {
    if (!isApplicationActive) return;
    toggleSidebar();
  }, [isApplicationActive, toggleSidebar]);

  useShortcut({ key: "T", shift: true }, handler);
}
