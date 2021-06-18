import "./TabNavigation.scss";
import React from "react";
import cx from "classnames";
import { useTabNavigationController } from "./useTabNavigationController";
import { IconButton } from "@material-ui/core";
import {
	Home as DashboardIcon,
	BarChart2 as AnalyticsIcon,
	User as UserIcon,
	Briefcase as BudgetIcon,
	PlusCircle as PlusIcon
} from "react-feather"

export type TabNavigationProps = {

};

export function TabNavigation(props: TabNavigationProps) {

	const controller = useTabNavigationController(props)

	return <aside className={cx("TabNavigation")}>

		<div className="tabContainer">
			<IconButton
				className={cx("tab", { active: controller.isDashboard })}
				onClick={controller.onDashboard}
			>
				<DashboardIcon />
			</IconButton>
		</div>

		<div className="tabContainer">
			<IconButton
				className={cx("tab", { active: controller.isAnalytics })}
				onClick={controller.onAnalytics}
			>
				<AnalyticsIcon />
			</IconButton>
		</div>

		<div className="tabContainer">
			<IconButton
				className={cx("tab", "add")}
				onClick={controller.onTransactionCreatorOpen}
			>
				<PlusIcon />
			</IconButton>
		</div>

		<div className="tabContainer">
			<IconButton
				className={cx("tab", { active: controller.isBudget })}
				onClick={controller.onBudget}
			>
				<BudgetIcon />
			</IconButton>
		</div>

		<div className="tabContainer">
			<IconButton
				className={cx("tab", { active: controller.isSettings })}
				onClick={controller.onSettings}
			>
				<UserIcon />
			</IconButton>
		</div>

	</aside>
}