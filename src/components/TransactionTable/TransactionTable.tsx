import "./TransactionTable.scss";
import { TransactionTableHeader } from "../TransactionTableHeader/TransactionTableHeader";
import { TransactionTableRow } from "../TransactionTableRow/TransactionTableRow";
import { AutoSizer, List } from "react-virtualized";
import { Type } from "../Type/Type";
import { TransactionTableRowSkeleton } from "../TransactionTableRowSkeleton/TransactionTableRowSkeleton";
import { useTransactionTableController } from "./useTransactionTableController";
import { AnimatePresence, motion } from "framer-motion";
import { DataUtils } from "../../utils/DataUtils/DataUtils";
import { Button } from "@material-ui/core";
import { ContainerBlock } from "../Container/ContainerBlock";

export type TransactionTableProps = {
	showSkeletons?: boolean;
}

export function TransactionTable(props: TransactionTableProps) {

	const controller = useTransactionTableController(props)


	if (controller.showSkeletons) {

		return <ContainerBlock className="TransactionTable">
			<TransactionTableHeader />
			<div className="listContainer">
				{
					DataUtils.createIndexArray(16).map(i => {
						return <TransactionTableRowSkeleton key={i} />
					})
				}
			</div>
		</ContainerBlock >
	}

	return <ContainerBlock className="TransactionTable">
		<TransactionTableHeader />
		<motion.div layout="position" className="listContainer">
			<AutoSizer className="autoSizer">
				{
					autoSizer => {
						return <List
							ref={controller.virtualizedListRef}
							className="virtualizedList"
							height={autoSizer.height}
							width={autoSizer.width}
							rowCount={controller.rowCount}
							rowHeight={({ index }) => controller.calculateRowHeight(index)}
							noRowsRenderer={() => <div className="noTransactions">
								<Type color="gray-700" variant="boldcaps" size="md">
									{"No transactions"}
								</Type>
							</div>}
							rowRenderer={(rowProps) => {

								if (rowProps.index === 0) {
									if (controller.upcomingItemsCount > 0) {
										return <motion.div
											layout="position"
											initial={false}
											className="upcomingTransactions"
											style={rowProps.style}
											key={rowProps.key}
										>
											<motion.div className="upcomingTransactionsHandle">
												<Button
													variant="text"
													color="primary"
													onClick={controller.handleToggleIsUpcomingOpen}
													fullWidth
												>
													{controller.isUpcomingOpen ? "Hide" : "Show"}
													{` ${controller.upcomingItemsCount} upcoming transactions`}
												</Button>
											</motion.div>
											<AnimatePresence>
												{
													controller.isUpcomingOpen &&
													<motion.div
														className="upcomingTransactionsList"
														exit={{ transformOrigin: "top", scaleY: 0, opacity: 0, transition: { duration: 0.18, type: "tween" } }}
														initial={{ transformOrigin: "top", scaleY: 0, opacity: 0 }}
														animate={{ transformOrigin: "top", scaleY: 1, opacity: 1 }}
													>
														{
															controller.upcomingItems.map(entry => {
																return <li key={entry.id}>
																	<TransactionTableRow
																		getAllTransactionIdsBetween={controller.getAllTransactionIdsBetween}
																		transaction={entry}
																	/>
																</li>
															})
														}
													</motion.div>
												}
											</AnimatePresence>
										</motion.div>
									} else {
										return null
									}
								}

								const entry = controller.items[rowProps.index - 1]
								return <li
									key={entry.id}
									style={rowProps.style}
									className="transactionTableRowContainer"
								>
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
	</ContainerBlock>
}