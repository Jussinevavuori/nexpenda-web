import { useRouteMatch } from "react-router-dom";
import { routes } from "../../Routes";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { useStoreState, useStoreActions } from "../../store";
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController";
import { TabNavigationProps } from "./TabNavigation";

export function useTabNavigationController(props: TabNavigationProps) {
  const dashboardMatch = useRouteMatch(routes.dashboard);
  const analyticsMatch = useRouteMatch(routes.analytics);
  const budgetsMatch = useRouteMatch(routes.budgets);
  const settingsMatch = useRouteMatch(routes.settings);

  const user = useStoreState((_) => _.auth.user);

  const logout = useStoreActions((_) => _.auth.logout);

  const redirect = useRedirect();

  const [, setTransactionCreatorOpen] = useTransactionCreatorDrawerOpenState();

  return {
    isDashboard: !!dashboardMatch,
    isAnalytics: !!analyticsMatch,
    isBudget: !!budgetsMatch,
    isSettings: !!settingsMatch,

    onDashboard() {
      redirect(routes.dashboard);
      unfocus();
    },
    onAnalytics() {
      redirect(routes.analytics);
      unfocus();
    },
    onBudget() {
      redirect(routes.budgets);
      unfocus();
    },
    onSettings() {
      redirect(routes.settings);
      unfocus();
    },

    user: user,
    logout: () => logout(),

    onTransactionCreatorOpen: () => setTransactionCreatorOpen(true),
  };
}

function unfocus() {
  try {
    const el = window.document.activeElement;
    if (el) {
      (el as HTMLElement).blur();
    }
  } catch (e) {
    return null;
  }
}
