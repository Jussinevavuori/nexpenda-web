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
import { motion, Variants } from "framer-motion";

export type TabNavigationProps = {

};

export function TabNavigation(props: TabNavigationProps) {

	const controller = useTabNavigationController(props)

	return <aside className={cx("TabNavigation")}>

		<motion.div
			className="tabContainer"
			variants={tabVariants}
			animate={controller.isDashboard ? "active" : "inactive"}
		>
			<IconButton
				className={cx("tab", { active: controller.isDashboard })}
				onClick={controller.onDashboard}
			>
				<DashboardIcon />
			</IconButton>

		</motion.div>

		<motion.div
			className="tabContainer"
			variants={tabVariants}
			animate={controller.isAnalytics ? "active" : "inactive"}
		>
			<IconButton
				className={cx("tab", { active: controller.isAnalytics })}
				onClick={controller.onAnalytics}
			>
				<AnalyticsIcon />
			</IconButton>

		</motion.div>

		<div className="tabContainer">
			<IconButton
				className={cx("tab", "add")}
				onClick={controller.onTransactionCreatorOpen}
			>
				<PlusIcon />
			</IconButton>
		</div>

		<motion.div
			className="tabContainer"
			variants={tabVariants}
			animate={controller.isBudget ? "active" : "inactive"}
		>
			<IconButton
				className={cx("tab", { active: controller.isBudget })}
				onClick={controller.onBudget}
			>
				<BudgetIcon />
			</IconButton>

		</motion.div>

		<motion.div
			className="tabContainer"
			variants={tabVariants}
			animate={controller.isSettings ? "active" : "inactive"}
		>
			<IconButton
				className={cx("tab", { active: controller.isSettings })}
				onClick={controller.onSettings}
			>
				<UserIcon />
			</IconButton>

		</motion.div>

	</aside>
}
const tabVariants: Variants = {
	"inactive": {
		scale: 1,
	},
	"active": {
		scale: 1.5,
		transition: {
			repeatType: "mirror",
			repeat: 1,
		}
	}
}