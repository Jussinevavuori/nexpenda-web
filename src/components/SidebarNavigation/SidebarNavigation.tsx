import "./SidebarNavigation.scss";
import React from "react";
import { useSidebarNavigationController } from "./useSidebarNavigationController";
import {
	Home as DashboardIcon,
	BarChart2 as AnalyticsIcon,
	User as UserIcon,
	Briefcase as BudgetIcon,
} from "react-feather"
import { Type } from "../../components/Type/Type";
import { createClassnames } from "../../lib/Utilities/createClassnames";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Replay } from "@material-ui/icons";
import { Logo } from "../Logo/Logo";
import { Tooltip } from "@material-ui/core";
import { CornerPiece } from "../CornerPiece/CornerPiece";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import { FreemiumTracker } from "../FreemiumTracker/FreemiumTracker";
import { Link } from "react-router-dom";
import { routes } from "../../Routes";

export type SidebarNavigationProps = {

};

export function SidebarNavigation(props: SidebarNavigationProps) {

	const controller = useSidebarNavigationController(props)
	const isDarkTheme = useIsDarkTheme()
	const cx = createClassnames({
		open: controller.isOpen,
		closed: !controller.isOpen
	})

	return <motion.aside
		className={cx("SidebarNavigation")}
		animate={controller.isOpen
			? { width: "23vw" }
			: { width: "min-content" }
		}
	>


		<div className={cx("header")}>
			<div className={cx("logoContainer")}>
				<AnimatePresence>
					<motion.div
						className="logo"
						initial={{ opacity: 0, scaleX: 0 }}
						animate={{ opacity: 1, scaleX: 1 }}
						exit={{ opacity: 0, scaleX: 0 }}
					>
						<Logo
							showIcon
							showText={controller.isOpen}
						/>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>

		<div className={cx("body")}>
			<div className={cx("links")}>

				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color={isDarkTheme ? "white" : "gray-900"}>
							{"Dashboard"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-600"}>
							{"(Alt + 1)"}
						</Type>
					</div>}
				>
					<Link to={routes.dashboard.path}>
						<motion.button className={cx("link", {
							activePrimary: controller.dashboardPathLevel === 1,
							activeSecondary: controller.dashboardPathLevel > 1
						})}>
							<DashboardIcon />
							<Type variant="bold">{"Dashboard"}</Type>
						</motion.button>
					</Link>
				</Tooltip>

				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color={isDarkTheme ? "white" : "gray-900"}>
							{"Analytics"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-600"}>
							{"(Alt + 2)"}
						</Type>
					</div>}
				>
					<Link to={routes.analytics.path}>
						<motion.button className={cx("link", {
							activePrimary: controller.analyticsPathLevel === 1,
							activeSecondary: controller.analyticsPathLevel > 1
						})}>
							<AnalyticsIcon />
							<Type variant="bold">{"Analytics"}</Type>
						</motion.button>
					</Link>
				</Tooltip>


				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color={isDarkTheme ? "white" : "gray-900"}>
							{"Budgets"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-600"}>
							{"(Alt + 3)"}
						</Type>
					</div>}
				>
					<Link to={routes.budgets.path}>
						<motion.button className={cx("link", {
							activePrimary: controller.budgetsPathLevel === 1,
							activeSecondary: controller.budgetsPathLevel > 1
						})} >
							<BudgetIcon />
							<Type variant="bold">{"Budgets"}</Type>
						</motion.button>
					</Link>
				</Tooltip>


				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color={isDarkTheme ? "white" : "gray-900"}>
							{"Settings"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-600"}>
							{"(Alt + 4)"}
						</Type>
					</div>}
				>
					<Link to={routes.settings.path}>
						<motion.button className={cx("link", {
							hasSubmenu: !!controller.settingsPathLevel,
							activePrimary: controller.settingsPathLevel === 1,
							activeSecondary: controller.settingsPathLevel > 1
						})}>
							<UserIcon />
							<Type variant="bold">{"Settings"}</Type>
						</motion.button>
					</Link>
				</Tooltip>

				<AnimatePresence>
					{
						controller.settingsPathLevel &&
						<motion.div
							className={cx("submenu")}
							initial={{ scaleY: 0, opacity: 0, transformOrigin: "top" }}
							animate={{ scaleY: 1, opacity: 1, transformOrigin: "top" }}
							exit={{ scaleY: 0, opacity: 0, transformOrigin: "top" }}
						>
							<Tooltip
								title={<div className="SidebarNavigation__linkTooltip">
									<Type variant="bold" color={isDarkTheme ? "white" : "gray-900"}>
										{"Schedules"}
									</Type>
								</div>}
							>
								<Link to={routes.schedules.path}>
									<motion.button className={cx("link", {
										activePrimary: controller.schedulesPathLevel === 1,
										activeSecondary: controller.schedulesPathLevel > 1
									})}>
										<Replay />
										<Type variant="bold">{"Schedules"}</Type>
									</motion.button>
								</Link>
							</Tooltip>
						</motion.div>
					}
				</AnimatePresence>



			</div>

			<div className="extra">
				<FreemiumTracker
					variant={controller.isOpen ? "default" : "minimal"}
				/>
			</div>

			<div className="actions">

				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color={isDarkTheme ? "white" : "gray-900"}>
							{"Toggle sidebar"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-600"}>
							{"(Shift + T)"}
						</Type>
					</div>}
				>
					<motion.button
						onClick={controller.toggleOpen}
						className={cx("toggle")}
					>
						<motion.span
							animate={{ rotate: controller.isOpen ? 0 : 180 }}
						>
							<ChevronLeft />
						</motion.span>
					</motion.button>
				</Tooltip>
			</div>

		</div>

		<CornerPiece
			fill="white"
			className="cornerPiece"
			size={8}
			position="top-left"
			variant="internal"
		/>

	</motion.aside >
}