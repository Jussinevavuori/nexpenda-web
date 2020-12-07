import "./TransactionList.scss";
import React, { createRef, useEffect, useRef } from "react"
import { TransactionListItem } from "../TransactionListItem/TransactionListItemController";
import { Transaction } from "../../classes/Transaction";
import { format } from "date-fns"
import { AutoSizer, List } from "react-virtualized"
import { Type } from "../Type/Type";
import { TransactionListItemSkeleton } from "../TransactionListItemSkeleton/TransactionListItemSkeleton";
import { motion, Variants } from "framer-motion";

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
	 * Delay offset in seconds for staggering the animations
	 */
	const delayOffset = useRef<number>(0)

	/**
	 * Reset the offset delay counter every render
	 */
	useEffect(() => { delayOffset.current = 0 }, [props])

	/**
	 * Skeletons
	 */
	if (props.showSkeletons) {
		return <div className="TransactionList">
			{
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
					return <TransactionListItemSkeleton i={i} key={i} />
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

						/**
						 * Title total height    40 px
						 * Item total height     80 px
						 */

						return props.itemsByDates[index].items.length * 80 + 40
					}}
					noRowsRenderer={() => {
						return <Type className="emptyTransactions">
							{"No transactions"}
						</Type>
					}}
					rowRenderer={(rowProps) => {
						const entry = props.itemsByDates[rowProps.index]

						const delay = delayOffset.current
						delayOffset.current += 0.2

						return <motion.div
							variants={listItemVariants}
							className="dateGroup"
							key={rowProps.key}
							style={rowProps.style}
							transition={{ delay, duration: 1 }}
							initial="hidden"
							animate="show"
						>
							<Type variant="bold" color="gray-800" size="md">
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
						</motion.div>
					}}
				/>
			}
		</AutoSizer>

	</div>
}

function toDatestring(date: Date) {
	return date.getFullYear() === currentYear
		? format(date, "dd.MM.")
		: format(date, "dd.MM.yyyy")
}

const currentYear = new Date().getFullYear()

const listItemVariants: Variants = {
	hidden: {
		x: -20,
		opacity: 0,
	},
	show: {
		x: 0,
		opacity: 1,
	}
}