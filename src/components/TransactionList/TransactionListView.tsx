import "./TransactionList.scss";
import React, { createRef, useEffect } from "react"
import { TransactionListing } from "../TransactionListing/TransactionListing";
import { Transaction } from "../../models/transactions/transactions.class";
import { format } from "date-fns"
import { AutoSizer, List } from "react-virtualized"
import { Type } from "../Type/Type";

export type TransactionListViewProps = {
	itemsByDates: {
		date: Date;
		items: Transaction[];
	}[]
}

export function TransactionListView(props: TransactionListViewProps) {

	/**
	 * Reference to virtualized list component for public methods
	 */
	const virtualizedListRef = createRef<List>()

	/**
	 * Force virtualized list to recompute row heights each time
	 * the props change
	 */
	useEffect(() => {
		virtualizedListRef.current?.recomputeRowHeights()
	}, [props, virtualizedListRef])

	return <div className="TransactionList">

		<AutoSizer className="autoSizer">
			{
				(autoSizer) => <List
					ref={virtualizedListRef}
					className="virtualizedList"
					height={autoSizer.height}
					width={autoSizer.width}
					rowCount={props.itemsByDates.length}
					rowHeight={({ index }) => {
						return props.itemsByDates[index].items.length * 68 + 48
					}}
					noRowsRenderer={() => {
						return <Type>
							{"No transactions"}
						</Type>
					}}
					rowRenderer={(rowProps) => {
						const entry = props.itemsByDates[rowProps.index]
						return <div className="dateGroup" key={rowProps.key} style={rowProps.style}>
							<Type>
								{toDatestring(entry.date)}
							</Type>
							<ul>
								{
									entry.items.map(item => {
										return <li key={item.id}>
											<TransactionListing transaction={item} />
										</li>
									})
								}
							</ul>
						</div>
					}}
				/>
			}
		</AutoSizer>

	</div >
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "dd.MM.")
		: format(date, "dd.MM.yyyy")
}

const currentYear = new Date().getFullYear()