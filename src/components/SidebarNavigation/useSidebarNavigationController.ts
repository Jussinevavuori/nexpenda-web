import { routes } from "../../Routes";
import { useStoreState, useStoreActions } from "../../store";
import { SidebarNavigationProps } from "./SidebarNavigation";
import { usePathLevel } from "../../hooks/utils/useRouteMatchLevel";

export function useSidebarNavigationController(props: SidebarNavigationProps) {
  const user = useStoreState((_) => _.auth.user);
  const logout = useStoreActions((_) => _.auth.logout);

  const isOpen = useStoreState((_) => _.sidebar.isOpen);
  const toggleOpen = useStoreActions((_) => _.sidebar.toggle);

  const dashboardPathLevel = usePathLevel(routes.dashboard);
  const analyticsPathLevel = usePathLevel(routes.analytics);
  const budgetsPathLevel = usePathLevel(routes.budgets);
  const settingsPathLevel = usePathLevel(routes.settings);
  const schedulesPathLevel = usePathLevel(routes.schedules);

  return {
    isOpen,
    toggleOpen: () => {
      toggleOpen();
    },

    dashboardPathLevel,
    analyticsPathLevel,
    budgetsPathLevel,
    settingsPathLevel,
    schedulesPathLevel,

    user: user,
    logout: () => logout(),
  };
}
