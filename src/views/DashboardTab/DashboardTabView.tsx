import "./DashboardTab.scss"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { Auth } from "../../models/authentication/auth.class";
import { MoneyAmount } from "../../utils/MoneyAmount";
import { ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon } from "react-feather"
import { TransactionListFilters } from "../../components/TransactionListFilters/TransactionListFiltersController";

import textureImg from "../../images/pexels-johannes-plenio-1103970.jpg"

const styles: Record<string, string> = {}

export type DashboardTabViewProps = {
	user: Auth;
	dateIntervalMonthString: string | undefined;
	dateIntervalIsMonth: boolean;
	filteredSum: MoneyAmount;
	filteredIncomesSum: MoneyAmount;
	filteredExpensesSum: MoneyAmount;

	setNextMonthAsDateInterval(): void;
	setPreviousMonthAsDateInterval(): void;
}

export function DashboardTabView(props: DashboardTabViewProps) {

	return <div className="DashboardTab">

		<header>

			<img src={textureImg} alt="" />

			<h1>
				{props.dateIntervalMonthString}
			</h1>

			<div className="totals">

				<h2 className={styles.totalHeader}>
					<span>
						{props.filteredSum.formatSign + " "}
					</span>
					<span className={styles.larger}>
						{props.filteredSum.formatEuros}
					</span>
					<span>
						{"." + props.filteredSum.formatCents + " €"}
					</span>
				</h2>

				<div className="subtotals">
					<div className="subtotal">
						<ChevronUpIcon />
						<span>
							{props.filteredIncomesSum.formatFull}
						</span>
					</div>
					<div className="subtotal">
						<ChevronDownIcon />
						<span>
							{props.filteredExpensesSum.formatFull}
						</span>
					</div>
				</div>

			</div>

		</header>

		<main>

			<div className="filters">

				<TransactionListFilters />

			</div>

			<div className="list">

				<TransactionList />

			</div>

		</main>

	</div>

}