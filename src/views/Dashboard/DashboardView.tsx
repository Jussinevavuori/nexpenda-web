import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionListController";
import { Auth } from "../../classes/Auth";
import { MoneyAmount } from "../../classes/MoneyAmount";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { FiltersPanel } from "../../components/FiltersPanel/FiltersPanelController";
import { useLgMedia } from "../../hooks/useMedia";
import { TransactionTable } from "../../components/TransactionTable/TransactionTableController";
import { ActiveFilters } from "../../components/ActiveFilters/ActiveFiltersController";
import { Transaction } from "../../classes/Transaction";
import { SelectionPanel } from "../../components/SelectionPanel/SelectionPanelController";

export type DashboardViewProps = {
	user: Auth;
	intervalString: string;

	filteredSum: MoneyAmount;
	filteredIncomesSum: MoneyAmount;
	filteredExpensesSum: MoneyAmount;

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

				<div className="activeFilters">
					<ActiveFilters />
				</div>

			</div>

		</PageHeader>

		<section className="panel">

			{
				props.selectionActive
					? <SelectionPanel />
					: <FiltersPanel />
			}

		</section>

		<section className="transactionsList">

			{
				desktopLayout
					? <TransactionTable />
					: <TransactionList />
			}

		</section>

	</div>

}