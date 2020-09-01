import styles from "./DashboardTabView.module.css"
import React from "react";
import { TransactionList } from "../../components/TransactionList/TransactionList";
import { Auth } from "../../models/authentication/auth.class";
import { useStoreState, useStoreActions } from "../../store";

export type DashboardTabViewProps = {
	user: Auth;
}

export function DashboardTabView(props: DashboardTabViewProps) {

	// const startDate = useStoreState(_ => _.transactionInterval.startDate)
	// const endDate = useStoreState(_ => _.transactionInterval.endDate)
	// const dateIntervalIsMonth = useStoreState(_ => _.transactionInterval.dateIntervalIsMonth)
	const dateIntervalMonthString = useStoreState(_ => _.transactionInterval.dateIntervalMonthString)

	const setNextMonthAsDateInterval = useStoreActions(_ => _.transactionInterval.setNextMonthAsDateInterval)
	const setPreviousMonthAsDateInterval = useStoreActions(_ => _.transactionInterval.setPreviousMonthAsDateInterval)

	return <div className={styles.root}>

		<header className={styles.header}>

			<h1>
				{dateIntervalMonthString}
			</h1>

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