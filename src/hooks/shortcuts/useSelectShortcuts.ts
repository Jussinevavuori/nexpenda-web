import { useCallback } from "react";
import { routes } from "../../Routes";
import { useStoreState, useStoreActions } from "../../store";
import { useIsApplicationActive } from "../application/useIsApplicationActive";
import { useRouteData } from "../application/useRouteData";
import { useShortcut } from "./useShortcut";

export function useSelectShortcuts() {
  const isApplicationActive = useIsApplicationActive();
  const routeData = useRouteData();
  const filteredTransactions = useStoreState(
    (_) => _.transactions.filteredItems
  );
  const selectAll = useStoreActions((_) => _.selection.selectAll);
  const deselectAll = useStoreActions((_) => _.selection.deselectAll);

  const handleSelectAll = useCallback(() => {
    if (isApplicationActive && routeData?.name === routes.dashboard.name) {
      selectAll(filteredTransactions.map((_) => _.id));
    }
  }, [isApplicationActive, routeData, selectAll, filteredTransactions]);

  const handleDeselectAll = useCallback(() => {
    if (isApplicationActive && routeData?.name === routes.dashboard.name) {
      deselectAll();
    }
  }, [isApplicationActive, routeData, deselectAll]);

  useShortcut({ key: "A", shift: true }, handleSelectAll);
  useShortcut({ key: "A", shift: true, alt: true }, handleDeselectAll);
}
