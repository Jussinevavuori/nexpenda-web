import "./Sidebar.scss";
import React from "react"
import cx from "classnames"
import { IconButton } from "@material-ui/core";
import {
	Home as DashboardIcon,
	BarChart2 as AnalyticsIcon,
	User as UserIcon,
	Briefcase as BudgetIcon,
	PlusCircle as PlusIcon
} from "react-feather"
import { useMdMedia } from "../../hooks/utils/useMedia";
import { Type } from "../../components/Type/Type";
import { Logo } from "../../components/Logo/Logo";
import { motion, Variants } from "framer-motion";
import { useSidebarController } from "./useSidebarController";

export type SidebarProps = {
}

export function Sidebar(props: SidebarProps) {

	const isSidebarView = useMdMedia()

	const controller = useSidebarController(props)

	return <>

		<aside className="Sidebar">

			{

				isSidebarView
					? <div className="sidebar">


						{
							/** 
							 * Desktop sidebar layout
							 */
						}

						<div className="header">

							<Logo />

						</div>

						<div className="body">

							<div className="selections">

								<Type
									className="selections-title"
									variant="boldcaps"
									color="gray-800"
									size="sm"
								>
									{"Tools"}
								</Type>

								<button
									onClick={controller.onDashboard}
									className={cx("selection", { active: controller.isDashboard })}
								>
									<DashboardIcon />
									<Type variant="bold">{"Dashboard"}</Type>
								</button>

								<button
									onClick={controller.onAnalytics}
									className={cx("selection", { active: controller.isAnalytics })}
								>
									<AnalyticsIcon />
									<Type variant="bold">{"Analytics"}</Type>
								</button>

								<button
									onClick={controller.onBudget}
									className={cx("selection", { active: controller.isBudget })}
								>
									<BudgetIcon />
									<Type variant="bold">{"Budget"}</Type>
								</button>

								<button
									onClick={controller.onSettings}
									className={cx("selection", { active: controller.isSettings })}
								>
									<UserIcon />
									<Type variant="bold">{"Settings"}</Type>
								</button>

							</div>

						</div>

					</div>
					: <div className="tabs">

						{
							/**
							 * Mobile bottom navigation
							 */
						}

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

					</div>
			}
		</aside>

	</>
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