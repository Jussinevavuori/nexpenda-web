import "./TransactionTable.scss";
import React from "react"
import { Transaction } from "../../classes/Transaction";
import { TransactionTableHeader } from "../TransactionTableHeader/TransactionTableHeaderController";
import { TransactionTableRow } from "../TransactionTableRow/TransactionTableRowController";
import { AutoSizer, List } from "react-virtualized";
import { Type } from "../Type/Type";

export type TransactionTableViewProps = {
	items: Transaction[]
}

export function TransactionTableView(props: TransactionTableViewProps) {

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
							rowCount={props.items.length}
							rowHeight={36}
							noRowsRenderer={() => <div className="noTransactions">
								<Type>
									{"No transactions"}
								</Type>
							</div>}
							rowRenderer={(rowProps) => {
								const entry = props.items[rowProps.index]
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