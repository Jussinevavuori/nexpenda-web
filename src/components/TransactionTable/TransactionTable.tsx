import "./TransactionTable.scss";
import React, { createRef, useEffect } from "react"
import { TransactionTableHeader } from "../TransactionTableHeader/TransactionTableHeader";
import { TransactionTableRow } from "../TransactionTableRow/TransactionTableRow";
import { AutoSizer, List } from "react-virtualized";
import { Type } from "../Type/Type";
import { TransactionTableRowSkeleton } from "../TransactionTableRowSkeleton/TransactionTableRowSkeleton";
import { useTransactionTableController } from "./useTransactionTableController";
import { motion } from "framer-motion";
import { DataUtils } from "../../utils/DataUtils/DataUtils";
import { useLgMedia } from "../../hooks/utils/useMedia";

export type TransactionTableProps = {
	showSkeletons?: boolean;
}

const virtualizedListRef = createRef<List>()

export function TransactionTable(props: TransactionTableProps) {

	const isLargeScreen = useLgMedia()
	const controller = useTransactionTableController(props)

	// Recalculate virtualized list row heights each time the 
	// props change / editing state changes / screen size passes
	// large threshold
	useEffect(() => {
		const virtualizedList = virtualizedListRef.current
		if (virtualizedList) {
			virtualizedList.recomputeRowHeights()
		}
	}, [props, controller.editingId, isLargeScreen, controller.items])

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
							ref={virtualizedListRef}
							className="virtualizedList"
							height={autoSizer.height}
							width={autoSizer.width}
							rowCount={controller.items.length}
							rowHeight={({ index }) => {
								return controller.items[index].id === controller.editingId
									? (isLargeScreen ? 60 : 110)
									: 40
							}}
							noRowsRenderer={() => <div className="noTransactions">
								<Type color="gray-700" variant="boldcaps" size="md">
									{"No transactions"}
								</Type>
							</div>}
							rowRenderer={(rowProps) => {
								const entry = controller.items[rowProps.index]
								return <li key={rowProps.key} style={rowProps.style}>
									<TransactionTableRow
										getAllTransactionIdsBetween={controller.getAllTransactionIdsBetween}
										transaction={entry}
									/>
								</li>
							}}
						/>
					}
				}
			</AutoSizer>
		</motion.div>
	</div>
}