import "./TransactionTable.scss";
import React from "react"
import { TransactionTableHeader } from "../TransactionTableHeader/TransactionTableHeader";
import { TransactionTableRow } from "../TransactionTableRow/TransactionTableRow";
import { AutoSizer, List } from "react-virtualized";
import { Type } from "../Type/Type";
import { TransactionTableRowSkeleton } from "../TransactionTableRowSkeleton/TransactionTableRowSkeleton";
import { useTransactionTableController } from "./useTransactionTableController";
import { motion } from "framer-motion";
import { DataUtils } from "../../utils/DataUtils/DataUtils";

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
					DataUtils.createIndexArray(16).map(i => {
						return <TransactionTableRowSkeleton key={i} />
					})
				}
			</div>
		</div >
	}

	return <div className="TransactionTable">
		<TransactionTableHeader />
		<motion.div layout="position" className="listContainer">
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
		</motion.div>
	</div>
}