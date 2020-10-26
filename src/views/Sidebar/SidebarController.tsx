import React from "react"
import { SidebarView } from "./SidebarView"
import { useRouteMatch } from "react-router-dom"
import { routes } from "../../Routes"
import { useRedirect } from "../../hooks/useRedirect"
import { useStoreState, useStoreActions } from "../../store"
import { useTransactionCreatorDrawerOpenState } from "../../components/TransactionCreatorDrawer/TransactionCreatorDrawerController"

export type SidebarProps = {

}

export function Sidebar(props: SidebarProps) {

	const dashboardMatch = useRouteMatch(routes.dashboard)
	const analyticsMatch = useRouteMatch(routes.analytics)
	const budgetMatch = useRouteMatch(routes.budget)
	const settingsMatch = useRouteMatch(routes.settings)

	const user = useStoreState(_ => _.auth.user)

	const logout = useStoreActions(_ => _.auth.logout)

	const redirect = useRedirect()

	const [, setTransactionCreatorOpen] = useTransactionCreatorDrawerOpenState()

	if (!user) return null

	return <SidebarView

		isDashboard={!!dashboardMatch}
		onDashboard={() => redirect(routes.dashboard)}

		isAnalytics={!!analyticsMatch}
		onAnalytics={() => redirect(routes.analytics)}

		isBudget={!!budgetMatch}
		onBudget={() => redirect(routes.budget)}

		isSettings={!!settingsMatch}
		onSettings={() => redirect(routes.settings)}

		user={user}
		logout={() => logout()}

		onTransactionCreatorOpen={() => setTransactionCreatorOpen(true)}

	/>
}