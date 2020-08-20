import React from "react"
import cx from "classnames"
import { makeStyles, IconButton } from "@material-ui/core"
import {
	Home as DashboardIcon,
	Assessment as AnalyticsIcon,
	AccountBalance as BudgetIcon,
	Person as UserIcon,
	Add as NewTransactionIcon,
} from "@material-ui/icons"
import { useHistory, useRouteMatch } from "react-router-dom"
import { routes } from "../../Routes"

export default function AppTabs() {

	const styles = useStyles()

	const history = useHistory()

	const dashboardMatch = useRouteMatch(routes.dashboard)
	const analyticsMatch = useRouteMatch(routes.analytics)
	const budgetMatch = useRouteMatch(routes.budget)
	const settingsMatch = useRouteMatch(routes.settings)

	return <div className={cx(styles.root, "AppTabs")}>

		<div className={styles.content}>

			<div className={styles.spacer} />
			<div className={cx(styles.tab, { active: !!dashboardMatch })}>
				<IconButton onClick={() => history.push(routes.dashboard)}>
					<DashboardIcon />
				</IconButton>
			</div>
			<div className={cx(styles.tab, { active: !!analyticsMatch })}>
				<IconButton onClick={() => history.push(routes.analytics)}>
					<AnalyticsIcon />
				</IconButton>
			</div>


			<div className={cx(styles.centerTab)}>

				<div className={cx(styles.centerTabBackground)}>
					<svg id="center-tab-svg" version="1.1" x="0px" y="0px" width="100px" height="60px" viewBox="0 0 100 60">
						<defs>
							<clipPath id="center-tab-clip-path">
								<path d="M99.2,0C89.6,0,81,5.5,76.5,14c-5,9.5-15,16-26.5,16s-21.5-6.5-26.5-16C19,5.5,10.4,0,0.8,0L0,0v60h100V0
	L99.2,0z"/>
							</clipPath>
						</defs>
					</svg>
				</div>

				<IconButton className={cx(styles.floatingButton)} onClick={() => console.log("Clicked")}>
					<NewTransactionIcon />
				</IconButton>

			</div>


			<div className={cx(styles.tab, { active: !!budgetMatch })}>
				<IconButton onClick={() => history.push(routes.budget)}>
					<BudgetIcon />
				</IconButton>
			</div>
			<div className={cx(styles.tab, { active: !!settingsMatch })}>
				<IconButton onClick={() => history.push(routes.settings)}>
					<UserIcon />
				</IconButton>
			</div>

			<div className={styles.spacer} />

		</div>
	</div>
}

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		height: "100%",
	},

	spacer: {
		height: "100%",
		width: theme.spacing(2),
		background: theme.palette.grey[50],
	},

	content: {
		display: "flex",
		height: "100%",
		filter: `drop-shadow(5px 5px 15px rgba(0,0,0,0.16))`,
	},

	centerTabBackground: {
		background: theme.palette.grey[50],
		width: "100%",
		height: "100%",
		clipPath: "url(#center-tab-clip-path)",

		"#center-tab-svg, #center-tab-clip-path": {
			width: 100,
			height: 60,
		},
	},

	centerTab: {
		position: "relative",
		width: 100,
		height: 60,
	},

	floatingButton: {
		position: "absolute",
		top: 0,
		left: "50%",
		transform: "translate(-50%,-50%)",
		borderRadius: "50%",
		background: theme.palette.primary.main,
		filter: `drop-shadow(5px 5px 15px rgba(0,0,0,0.16))`,
		"& *": {
			color: "white",
		},
		"&:hover": {
			backgroundColor: theme.palette.primary.light,
		}
	},

	tab: {
		background: theme.palette.grey[50],
		height: 60,
		width: "100%",
		flex: 1,
		display: "grid",
		placeItems: "center",

		"& *": {
			color: theme.palette.grey[600],
		},

		"&.active *": {
			color: theme.palette.primary.main,
		},

		"& .MuiIconButton-root": {
			height: "100%",
			width: "100%",
			borderRadius: 0,
		}
	},

}))