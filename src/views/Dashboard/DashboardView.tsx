import "./Dashboard.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { Auth } from "../../models/authentication/auth.class";
import { MoneyAmount } from "../../utils/MoneyAmount";
// import { ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon } from "react-feather"
import { TransactionListFilters } from "../../components/TransactionListFilters/TransactionListFiltersController";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { MoneyType } from "../../components/MoneyType/MoneyType";

export type DashboardViewProps = {
	user: Auth;
	intervalString: string;

	filteredSum: MoneyAmount;
	filteredIncomesSum: MoneyAmount;
	filteredExpensesSum: MoneyAmount;
}

export function DashboardView(props: DashboardViewProps) {

	return <div className="Dashboard">

		<PageHeader>

			<div className="totals">

				<MoneyType
					amount={props.filteredSum}
					variant="h4"
				/>

			</div>

		</PageHeader>

		<div className="filters">

			<TransactionListFilters />

		</div>

		<main>

			<div className="list">

				<TransactionList />

			</div>

		</main>

	</div>

}