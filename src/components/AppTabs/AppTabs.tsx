import styles from "./AppTabs.module.css"
import React from "react"
import cx from "classnames"
import { useRouteMatch } from "react-router-dom"
import { routes } from "../../Routes"
import { useRedirect } from "../../hooks/useRedirect"
import {
	Home as DashboardIcon,
	BarChart2 as AnalyticsIcon,
	Settings as SettingsIcon,
	Briefcase as BudgetIcon,
	Plus as PlusIcon
} from "react-feather"
import { useMinWidthMedia } from "../../hooks/useMedia"
import { useStoreActions } from "../../store"

export default function AppTabs() {

	const redirect = useRedirect()

	const openTransactionsForm = useStoreActions(_ => _.transactionForm.open)

	const sidebarView = useMinWidthMedia(600)

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

			{
				sidebarView ?
					<button
						onClick={() => openTransactionsForm()}
						className={cx(styles.tab, styles.addTab)}
					>
						<PlusIcon />
						<span>{"New transaction"}</span>
					</button>
					: <div className={styles.plusButtonContainer}>

						<svg version="1.1" x="0px" y="0px" width="108px" height="60px" viewBox="0 0 108 60" >
							<path d={svgPath} />
						</svg>

						<button
							onClick={() => openTransactionsForm()}
							className={styles.plusButton}
						>
							<PlusIcon />
						</button>
					</div>
			}

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
	</div >

}


const svgPath = `M80.2,23.4C72.9,30.7,64.4,35,54,35s-18.9-4.3-26.2-11.6C20.5,16.1,10,0,0,0v60h54h54V0C98, 0, 87.5, 16.1, 80.2, 23.4z`