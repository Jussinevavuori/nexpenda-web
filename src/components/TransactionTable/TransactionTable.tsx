import "./TransactionTable.scss";
import React from "react"
import { TransactionTableHeader } from "../TransactionTableHeader/TransactionTableHeaderController";
import { TransactionTableRow } from "../TransactionTableRow/TransactionTableRowController";
import { AutoSizer, List } from "react-virtualized";
import { Type } from "../Type/Type";
import { TransactionTableRowSkeleton } from "../TransactionTableRowSkeleton/TransactionTableRowSkeleton";
import { useTransactionTableController } from "./useTransactionTableController";

export type TransactionTableProps = {
	showSkeletons?: boolean;
}

export function TransactionTable(props: TransactionTableProps) {

	const controller = useTransactionTableController(props)

	if (controller.showSkeletons) {

		return <div className="TransactionTable">
			<TransactionTableHeader />
			<div className="listContainer">
				{
					[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
						return <TransactionTableRowSkeleton key={i} />
					})
				}
			</div>
		</div >
	}

	return <div className="TransactionTable">
		<TransactionTableHeader />
		<div className="listContainer">
			<AutoSizer className="autoSizer">
				{
					autoSizer => {
						return <List
							className="virtualizedList"
							height={autoSizer.height}
							width={autoSizer.width}
							rowCount={controller.items.length}
							rowHeight={40}
							noRowsRenderer={() => <div className="noTransactions">
								<Type color="gray-700" variant="boldcaps" size="md">
									{"No transactions"}
								</Type>
							</div>}
							rowRenderer={(rowProps) => {
								const entry = controller.items[rowProps.index]
								return <li key={rowProps.key} style={rowProps.style}>
									<TransactionTableRow transaction={entry} />
								</li>
							}}
						/>
					}
				}
			</AutoSizer>
		</div>
	</div>
}