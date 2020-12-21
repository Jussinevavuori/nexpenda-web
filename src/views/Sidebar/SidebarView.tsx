import "./Sidebar.scss";
import React from "react"
import cx from "classnames"
import { Auth } from "../../classes/Auth";
import { IconButton } from "@material-ui/core";
import {
	Home as DashboardIcon,
	BarChart2 as AnalyticsIcon,
	Settings as SettingsIcon,
	Briefcase as BudgetIcon,
	PlusCircle as PlusIcon
} from "react-feather"
import { useMdMedia } from "../../hooks/useMedia";
import { Type } from "../../components/Type/Type";
import { Logo } from "../../components/Logo/Logo";
import { motion, Variants } from "framer-motion";

export type SidebarViewProps = {
	isDashboard: boolean;
	onDashboard(): void;

	isAnalytics: boolean;
	onAnalytics(): void;

	isBudget: boolean;
	onBudget(): void;

	isSettings: boolean;
	onSettings(): void;

	user: Auth | null;
	logout(): void;

	onTransactionCreatorOpen(): void;

}

export function SidebarView(props: SidebarViewProps) {

	const sidebarView = useMdMedia()

	return <>

		<aside className="Sidebar">

			{

				sidebarView
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
									onClick={props.onDashboard}
									className={cx("selection", { active: props.isDashboard })}
								>
									<DashboardIcon />
									<Type variant="bold">{"Dashboard"}</Type>
								</button>

								<button
									onClick={props.onAnalytics}
									className={cx("selection", { active: props.isAnalytics })}
								>
									<AnalyticsIcon />
									<Type variant="bold">{"Analytics"}</Type>
								</button>

								<button
									onClick={props.onBudget}
									className={cx("selection", { active: props.isBudget })}
								>
									<BudgetIcon />
									<Type variant="bold">{"Budget"}</Type>
								</button>

								<button
									onClick={props.onSettings}
									className={cx("selection", { active: props.isSettings })}
								>
									<SettingsIcon />
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
							animate={props.isDashboard ? "active" : "inactive"}
						>
							<IconButton
								className={cx("tab", { active: props.isDashboard })}
								onClick={props.onDashboard}
							>
								<DashboardIcon />
							</IconButton>

						</motion.div>

						<motion.div
							className="tabContainer"
							variants={tabVariants}
							animate={props.isAnalytics ? "active" : "inactive"}
						>
							<IconButton
								className={cx("tab", { active: props.isAnalytics })}
								onClick={props.onAnalytics}
							>
								<AnalyticsIcon />
							</IconButton>

						</motion.div>

						<div className="tabContainer">
							<IconButton
								className={cx("tab", "add")}
								onClick={props.onTransactionCreatorOpen}
							>
								<PlusIcon />
							</IconButton>
						</div>

						<motion.div
							className="tabContainer"
							variants={tabVariants}
							animate={props.isBudget ? "active" : "inactive"}
						>
							<IconButton
								className={cx("tab", { active: props.isBudget })}
								onClick={props.onBudget}
							>
								<BudgetIcon />
							</IconButton>

						</motion.div>

						<motion.div
							className="tabContainer"
							variants={tabVariants}
							animate={props.isSettings ? "active" : "inactive"}
						>
							<IconButton
								className={cx("tab", { active: props.isSettings })}
								onClick={props.onSettings}
							>
								<SettingsIcon />
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