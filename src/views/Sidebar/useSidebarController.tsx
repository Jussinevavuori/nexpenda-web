import { useRouteMatch } from "react-router-dom"
import { routes } from "../../Routes"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useStoreState, useStoreActions } from "../../store"
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/useTransactionCreatorDrawerController"
import { SidebarProps } from "./Sidebar"

export function useSidebarController(props: SidebarProps) {

	const dashboardMatch = useRouteMatch(routes.dashboard)
	const analyticsMatch = useRouteMatch(routes.analytics)
	const budgetMatch = useRouteMatch(routes.budget)
	const settingsMatch = useRouteMatch(routes.settings)

	const user = useStoreState(_ => _.auth.user)

	const logout = useStoreActions(_ => _.auth.logout)

	const redirect = useRedirect()

	const [, setTransactionCreatorOpen] = useTransactionCreatorDrawerOpenState()

	return {
		isDashboard: !!dashboardMatch,
		isAnalytics: !!analyticsMatch,
		isBudget: !!budgetMatch,
		isSettings: !!settingsMatch,

		onDashboard: () => redirect(routes.dashboard),
		onAnalytics: () => redirect(routes.analytics),
		onBudget: () => redirect(routes.budget),
		onSettings: () => redirect(routes.settings),

		user: user,
		logout: () => logout(),


		onTransactionCreatorOpen: () => setTransactionCreatorOpen(true),
	}
}