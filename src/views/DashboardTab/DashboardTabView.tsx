import styles from "./DashboardTabView.module.css"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { Auth } from "../../models/authentication/auth.class";
import { useStoreState, useStoreActions } from "../../store";

export type DashboardTabViewProps = {
	user: Auth;
}

export function DashboardTabView(props: DashboardTabViewProps) {

	const dateIntervalMonthString = useStoreState(_ => _.transactions.interval.dateIntervalMonthString)
	const filteredItemsCount = useStoreState(_ => _.transactions.filteredCount)
	const filteredSum = useStoreState(_ => _.transactions.filteredSum)
	const filteredExpensesSum = useStoreState(_ => _.transactions.filteredExpensesSum)
	const filteredIncomesSum = useStoreState(_ => _.transactions.filteredIncomesSum)
	const setNextMonthAsDateInterval = useStoreActions(_ => _.transactions.interval.setNextMonthAsDateInterval)
	const setPreviousMonthAsDateInterval = useStoreActions(_ => _.transactions.interval.setPreviousMonthAsDateInterval)

	return <div className={styles.root}>

		<header className={styles.header}>

			<h1>
				{dateIntervalMonthString}
			</h1>

			<p>Total: {filteredSum.formatFull}</p>

			<p>{filteredIncomesSum.formatFull} / {filteredExpensesSum.formatFull}</p>

			<p>{filteredItemsCount} items</p>


			<button onClick={() => setPreviousMonthAsDateInterval()}>
				{"<"}
			</button>
			<button onClick={() => setNextMonthAsDateInterval()}>
				{">"}
			</button>

		</header>

		<div className={styles.body}>

			<TransactionList />

		</div>

	</div>

}