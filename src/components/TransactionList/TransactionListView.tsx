import styles from "./TransactionListView.module.css";
import React from "react"
import { TransactionListing } from "../TransactionListing/TransactionListing";
import { Transaction } from "../../models/transactions/transactions.class";
import { format } from "date-fns"

export type TransactionListViewProps = {
	itemsByDates: {
		date: Date;
		items: Transaction[];
	}[]
}

export function TransactionListView(props: TransactionListViewProps) {

	function toDatestring(date: Date) {
		return date.getFullYear() === currentYear
			? format(date, "dd.MM.")
			: format(date, "dd.MM.yyyy")
	}

	return <div className={styles.root}>

		<ul className={styles.datesList}>

			{
				props.itemsByDates.map(entry => {

					const datestring = toDatestring(entry.date)

					return <li key={datestring} className={styles.dateListing}>

						<p className={styles.datestring}>
							{datestring}
						</p>

						<ul className={styles.transactionsList}>

							{
								entry.items.map(item => {

									return <li key={item.id} className={styles.transactionListing}>
										<TransactionListing transaction={item} />
									</li>

								})
							}

						</ul>

					</li>

				})
			}

		</ul>

	</div>
}

const currentYear = new Date().getFullYear()