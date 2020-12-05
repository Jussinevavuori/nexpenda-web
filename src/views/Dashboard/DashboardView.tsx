import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionListController";
import { Auth } from "../../classes/Auth";
import { ActionsPanel } from "./ActionsPanel/ActionsPanelController";
import { useMdMedia } from "../../hooks/useMedia";
import { TransactionTable } from "../../components/TransactionTable/TransactionTableController";
import { Transaction } from "../../classes/Transaction";
import { DashboardHeader } from "./DashboardHeader/DashboardHeaderController";

export type DashboardViewProps = {
	user: Auth | null;
	intervalString: string;

	filtersActive: boolean;

	selectionActive: boolean;
	selection: Transaction[];
	onSelectAll(): void;
	onDeselectAll(): void;
}

export function DashboardView(props: DashboardViewProps) {

	const desktopLayout = useMdMedia()

	return <div className="Dashboard mobile">

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