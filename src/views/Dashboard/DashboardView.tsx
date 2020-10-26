import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionListController";
import { Auth } from "../../classes/Auth";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { FiltersPanel } from "../../components/FiltersPanel/FiltersPanelController";
import { useLgMedia } from "../../hooks/useMedia";
import { TransactionTable } from "../../components/TransactionTable/TransactionTableController";
import { ActiveFilters } from "../../components/ActiveFilters/ActiveFiltersController";
import { Transaction } from "../../classes/Transaction";
import { SelectionPanel } from "../../components/SelectionPanel/SelectionPanelController";
import { QuickAnalytics } from "../../components/QuickAnalytics/QuickAnalyticsController";

export type DashboardViewProps = {
	user: Auth;
	intervalString: string;

	filtersActive: boolean;

	selectionActive: boolean;
	selection: Transaction[];
	onSelectAll(): void;
	onDeselectAll(): void;
}

export function DashboardView(props: DashboardViewProps) {

	const desktopLayout = useLgMedia()

	return <div className="Dashboard">

		<PageHeader>

			<div className="pageHeaderContent">
				<QuickAnalytics />
			</div>

		</PageHeader>

		<section className="panel">

			{
				props.selectionActive
					? <SelectionPanel />
					: <FiltersPanel />
			}

		</section>

		{
			props.filtersActive
				? <section className="activeFilters">
					<ActiveFilters />
				</section>
				: null
		}

		<section className="transactionsList">

			{
				desktopLayout
					? <TransactionTable />
					: <TransactionList />
			}

		</section>

	</div>

}