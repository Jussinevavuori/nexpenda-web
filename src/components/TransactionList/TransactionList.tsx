import "./TransactionList.scss";
import { TransactionListItem } from "../TransactionListItem/TransactionListItem";
import { format } from "date-fns"
import { AutoSizer, List } from "react-virtualized"
import { Type } from "../Type/Type";
import { TransactionListItemSkeleton } from "../TransactionListItemSkeleton/TransactionListItemSkeleton";
import { useTransactionListController } from "./useTransactionListController";
import { Button } from "@material-ui/core";
import { DataUtils } from "../../utils/DataUtils/DataUtils";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";

export type TransactionListProps = {
	showSkeletons?: boolean;
}


export function TransactionList(props: TransactionListProps) {

	const controller = useTransactionListController(props)

	// Render skeletons
	if (controller.showSkeletons) {
		return <div className="TransactionList">
			{
				DataUtils.createIndexArray(16).map(i => {
					return <TransactionListItemSkeleton i={i} key={i} />
				})
			}
		</div >
	}

	// Render list
	return <AnimateSharedLayout>
		<motion.div className="TransactionList">

			{/* Actual items */}
			<AutoSizer className="autoSizer">
				{
					(autoSizer) => <motion.div layout="position" initial={false}>
						<List
							ref={controller.virtualizedListRef}
							className="virtualizedList"
							height={autoSizer.height}
							width={autoSizer.width}
							rowCount={controller.rowCount}
							rowHeight={({ index }) => controller.calculateRowHeight(index)}
							noRowsRenderer={() => {
								return <div className="emptyTransactions">
									<Type >
										{"No transactions. Start by creating your first transaction."}
									</Type>
									<Button
										color="primary"
										variant="contained"
										onClick={controller.handleCreate}
									>
										{"Create"}
									</Button>
								</div>
							}}
							rowRenderer={(rowProps) => {
								if (rowProps.index === 0) {

									if (controller.upcomingItemsByDates.length === 0) {
										return null
									}

									return <motion.div layout="position" initial={false} className="upcomingTransactions">
										<motion.div className="upcomingTransactionsHandle">
											<Type
												variant="bold"
												color="gray-600"
												onClick={controller.handleOpenUpcomingToggle}
											>
												{`${controller.upcomingTransactionsCount} upcoming transactions`}
											</Type>
											<Button
												variant="text"
												color="primary"
												onClick={controller.handleOpenUpcomingToggle}
											>
												{controller.isUpcomingOpen ? "Hide" : "Show"}
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
														controller.upcomingItemsByDates.map(entry => {
															return <div
																className="dateGroup upcoming"
																key={entry.date.getTime()}
															>
																<div className="dateGroupHeader upcoming">
																	<Type variant="bold" color="gray-700" size="md">
																		{toDatestring(entry.date)}
																	</Type>
																</div>
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
														})
													}
												</motion.div>
											}
										</AnimatePresence>
									</motion.div>
								} else {

									const entry = controller.itemsByDates[rowProps.index - 1]

									return <div
										className="dateGroup"
										key={rowProps.key}
										style={rowProps.style}
									>
										<div className="dateGroupHeader">
											<Type variant="bold" color="gray-700" size="md">
												{toDatestring(entry.date)}
											</Type>
										</div>
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
								}
							}}
						/>
					</motion.div>
				}
			</AutoSizer>
		</motion.div>
	</AnimateSharedLayout>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "dd.MM.")
		: format(date, "dd.MM.yyyy")
}

const currentYear = new Date().getFullYear()