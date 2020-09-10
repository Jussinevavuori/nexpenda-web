import "./Sidebar.scss";
import React from "react"
import { Auth } from "../../models/authentication/auth.class";
import { IconButton, Button, Drawer } from "@material-ui/core";
import {
	Home as DashboardIcon,
	BarChart2 as AnalyticsIcon,
	User as UserIcon,
	Settings as SettingsIcon,
	Briefcase as BudgetIcon,
	LogOut as LogoutIcon,
	Plus as PlusIcon
} from "react-feather"
import cx from "classnames"
import { TransactionForm } from "../../components/TransactionForm/TransactionFormController";
import { useSmMedia } from "../../hooks/useMedia";
import { Type } from "../../components/Type/Type";

export type SidebarViewProps = {
	isDashboard: boolean;
	onDashboard(): void;

	isAnalytics: boolean;
	onAnalytics(): void;

	isBudget: boolean;
	onBudget(): void;

	isSettings: boolean;
	onSettings(): void;

	user: Auth;
	logout(): void;

	transactionFormOpen: boolean;
	onTransactionFormOpen(): void;
	onTransactionFormClose(): void;
}

export function SidebarView(props: SidebarViewProps) {

	const sidebarView = useSmMedia()

	return <>

		<Drawer
			open={props.transactionFormOpen}
			onClose={props.onTransactionFormClose}
			anchor={sidebarView ? "left" : "bottom"}
		>
			<TransactionForm />
		</Drawer>

		<div className="Sidebar">

			{

				sidebarView

					? <div className="sidebar">

						<div className="header">

							<div className="top-row">

								<Type variant="h4" component="h6">
									{"Expence"}
								</Type>

								<IconButton onClick={props.logout}>
									<LogoutIcon />
								</IconButton>

							</div>

							<div className="bottom-row">

								<UserIcon />

								<Type>
									{props.user.displayName}
								</Type>

							</div>

						</div>

						<div className="body">

							<div className="tabContainer">

								<Button
									variant="text"
									className={cx("tab", { active: props.isDashboard })}
									onClick={props.onDashboard}
									startIcon={<DashboardIcon />}
								>
									{"Dashboard"}
								</Button>

							</div>

							<div className="tabContainer">

								<Button
									variant="text"
									className={cx("tab", { active: props.isAnalytics })}
									onClick={props.onAnalytics}
									startIcon={<AnalyticsIcon />}
								>
									{"Analytics"}
								</Button>

							</div>

							<div className="tabContainer">

								<Button
									variant="text"
									className={cx("tab", { active: props.isBudget })}
									onClick={props.onBudget}
									startIcon={<BudgetIcon />}
								>
									{"Budget"}
								</Button>

							</div>

							<div className="tabContainer">

								<Button
									variant="text"
									className={cx("tab", { active: props.isSettings })}
									onClick={props.onSettings}
									startIcon={<SettingsIcon />}
								>
									{"Settings"}
								</Button>

							</div>

							<div className="tabContainer addButton">

								<Button
									variant="text"
									className={cx("tab")}
									onClick={props.onTransactionFormOpen}
									startIcon={<PlusIcon />}
								>
									{"New transaction"}
								</Button>

							</div>

						</div>

					</div>

					: <div className="tabs">

						<div className="tabContainer">

							<IconButton
								className={cx("tab", { active: props.isDashboard })}
								onClick={props.onDashboard}
							>
								<DashboardIcon />
							</IconButton>

						</div>

						<div className="tabContainer">

							<IconButton
								className={cx("tab", { active: props.isAnalytics })}
								onClick={props.onAnalytics}
							>
								<AnalyticsIcon />
							</IconButton>

						</div>

						<div className="tabContainer">

							<IconButton
								className={cx("tab")}
								onClick={props.onTransactionFormOpen}
							>
								<PlusIcon />
							</IconButton>
						</div>


						<div className="tabContainer">

							<IconButton
								className={cx("tab", { active: props.isBudget })}
								onClick={props.onBudget}
							>
								<BudgetIcon />
							</IconButton>

						</div>

						<div className="tabContainer">

							<IconButton
								className={cx("tab", { active: props.isSettings })}
								onClick={props.onSettings}
							>
								<SettingsIcon />
							</IconButton>

						</div>

					</div>

			}

		</div>

	</>
}