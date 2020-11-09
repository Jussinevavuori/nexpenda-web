import "./TransactionList.scss";
import React, { createRef, useEffect } from "react"
import { TransactionListItem } from "../TransactionListItem/TransactionListItemController";
import { Transaction } from "../../classes/Transaction";
import { format } from "date-fns"
import { AutoSizer, List } from "react-virtualized"
import { Type } from "../Type/Type";
import { TransactionListItemSkeleton } from "../TransactionListItemSkeleton/TransactionListItemSkeleton";

export type TransactionListViewProps = {
	itemsByDates: {
		date: Date;
		items: Transaction[];
	}[],
	showSkeletons?: boolean;
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

	/**
	 * Skeletons
	 */
	if (props.showSkeletons) {
		return <div className="TransactionList">
			{
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {

					return <TransactionListItemSkeleton i={i} />

				})
			}
		</div >
	}

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
						return <Type className="emptyTransactions">
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
											<TransactionListItem transaction={item} />
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