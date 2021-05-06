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
import { createClassnames } from "../../utils/Utils/createClassnames";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "@material-ui/icons";
import { Logo } from "../Logo/Logo";
import { Tooltip } from "@material-ui/core";
import { CornerPiece } from "../CornerPiece/CornerPiece";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

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
						<Type variant="bold" color="white">
							{"Dashboard"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-400"}>
							{"(Alt + 1)"}
						</Type>
					</div>}
				>
					<motion.button
						onClick={controller.onDashboard}
						className={cx("link", { active: controller.isDashboard })}
					>
						<DashboardIcon />
						<Type variant="bold">{"Dashboard"}</Type>
					</motion.button>
				</Tooltip>

				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color="white">
							{"Analytics"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-400"}>
							{"(Alt + 2)"}
						</Type>
					</div>}
				>
					<motion.button
						onClick={controller.onAnalytics}
						className={cx("link", { active: controller.isAnalytics })}
					>
						<AnalyticsIcon />
						<Type variant="bold">{"Analytics"}</Type>
					</motion.button>
				</Tooltip>


				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color="white">
							{"Budgets"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-400"}>
							{"(Alt + 3)"}
						</Type>
					</div>}
				>
					<motion.button
						onClick={controller.onBudget}
						className={cx("link", { active: controller.isBudget })}
					>
						<BudgetIcon />
						<Type variant="bold">{"Budgets"}</Type>
					</motion.button>
				</Tooltip>


				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color="white">
							{"Settings"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-400"}>
							{"(Alt + 4)"}
						</Type>
					</div>}
				>
					<motion.button
						onClick={controller.onSettings}
						className={cx("link", { active: controller.isSettings })}
					>
						<UserIcon />
						<Type variant="bold">{"Settings"}</Type>
					</motion.button>
				</Tooltip>

			</div>

			<div className="actions">

				<Tooltip
					title={<div className="SidebarNavigation__linkTooltip">
						<Type variant="bold" color="primary-600">
							{"Toggle sidebar"}
						</Type>
						<Type color={isDarkTheme ? "white" : "gray-400"}>
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

	</motion.aside>
}