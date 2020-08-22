import styles from "./AppTabs.module.css"
import React from "react"
import cx from "classnames"
import { useRouteMatch } from "react-router-dom"
import { routes } from "../../Routes"
import { useRedirect } from "../../hooks/useRedirect"
import { Home as DashboardIcon, BarChart2 as AnalyticsIcon, Settings as SettingsIcon, Briefcase as BudgetIcon } from "react-feather"

export default function AppTabs() {

	const redirect = useRedirect()

	const dashboardMatch = useRouteMatch(routes.dashboard)
	const analyticsMatch = useRouteMatch(routes.analytics)
	const budgetMatch = useRouteMatch(routes.budget)
	const settingsMatch = useRouteMatch(routes.settings)

	return <div className={styles.root}>

		<div className={styles.tabContainer}>

			<button
				onClick={() => redirect(_ => _.dashboard)}
				className={cx(styles.tab, { [styles.tab_active]: !!dashboardMatch })}
			>
				<DashboardIcon />
				<span>{"Dashboard"}</span>
			</button>

			<button
				onClick={() => redirect(_ => _.analytics)}
				className={cx(styles.tab, { [styles.tab_active]: !!analyticsMatch })}
			>
				<AnalyticsIcon />
				<span>{"Analytics"}</span>
			</button>

			<button
				onClick={() => redirect(_ => _.budget)}
				className={cx(styles.tab, { [styles.tab_active]: !!budgetMatch })}
			>
				<BudgetIcon />
				<span>{"Budget"}</span>
			</button>

			<button
				onClick={() => redirect(_ => _.settings)}
				className={cx(styles.tab, { [styles.tab_active]: !!settingsMatch })}
			>
				<SettingsIcon />
				<span>{"Settings"}</span>
			</button>

		</div>
	</div>

}
