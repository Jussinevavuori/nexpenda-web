import styles from "./TransactionListingView.module.css";
import React from "react"
import cx from "classnames"
import { Transaction } from "../../models/transactions/transactions.class";
import { Plus as PlusIcon, Minus as MinusIcon } from "react-feather"

export type TransactionListingViewProps = {
	transaction: Transaction;
	handleDelete: Function;
}

export function TransactionListingView(props: TransactionListingViewProps) {

	return <div className={styles.root}>
		<div className={cx(styles.icon, props.transaction.amount.isPositive ? styles.icon_positive : styles.icon_negative)}>
			<div className={styles.iconContainer}>
				{
					props.transaction.amount.isPositive
						? <PlusIcon />
						: <MinusIcon />
				}
			</div>
		</div>
		<div className={styles.category}>
			<span>
				{props.transaction.category}
			</span>
		</div>
		<div className={styles.comment}>
			<span>
				{props.transaction.comment}
			</span>
		</div>
		<div className={cx(styles.amount, props.transaction.amount.isPositive ? styles.amount_positive : styles.amount_negative)}>
			<span>
				{props.transaction.amount.formatFull}
			</span>
		</div>
	</div>
}