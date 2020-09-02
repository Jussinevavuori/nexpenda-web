import "./TransactionList.scss";
import React from "react"
import { TransactionListing } from "../TransactionListing/TransactionListing";
import { Transaction } from "../../models/transactions/transactions.class";
import { format } from "date-fns"
import { useStoreActions } from "../../store";

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

	const del = useStoreActions(_ => _.transactions.deleteTransaction)

	return <div className="TransactionList">

		<ul >

			{
				props.itemsByDates.map(entry => {

					const datestring = toDatestring(entry.date)

					return <li key={datestring}>

						<p>
							{datestring}
						</p>

						<ul >

							{
								entry.items.map(item => {

									return <li key={item.id}
										onClick={() => {
											del(item.id).catch(error => {
												console.log("Error deleting:", error)
											})
										}}
									>

										<TransactionListing transaction={item} />

									</li>

								})
							}

						</ul>

					</li>

				})
			}

		</ul>

	</div >
}

const currentYear = new Date().getFullYear()