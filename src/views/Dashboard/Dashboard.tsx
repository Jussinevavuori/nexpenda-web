import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { ActionsPanel } from "./ActionsPanel/ActionsPanel";
import { useMdMedia } from "../../hooks/useMedia";
import { TransactionTable } from "../../components/TransactionTable/TransactionTableController";
import { DashboardHeader } from "./DashboardHeader/DashboardHeader";

export type DashboardProps = {
}

export function Dashboard(props: DashboardProps) {

	const desktopLayout = useMdMedia()


	return <div className="Dashboard">

		<section className="header">
			<DashboardHeader />
		</section>

		<section className="panel">
			<ActionsPanel />
		</section>

		<section className="transactionsList">

			{
				desktopLayout
					? <TransactionTable showSkeletons />
					: <TransactionList showSkeletons />
			}

		</section>

	</div>

}