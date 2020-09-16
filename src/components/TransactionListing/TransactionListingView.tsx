import "./TransactionListing.scss";
import React from "react"
import cx from "classnames"
import { Transaction } from "../../classes/Transaction";
import { Plus as PlusIcon, Minus as MinusIcon } from "react-feather"

export type TransactionListingViewProps = {
	transaction: Transaction;
	handleDelete: Function;
}

export function TransactionListingView(props: TransactionListingViewProps) {

	const signClass = props.transaction.amount.isPositive ? "positive" : "negative"

	return <div className="TransactionListing">
		<div className={cx("icon", signClass)}>
			<div className="iconContainer">
				{
					props.transaction.amount.isPositive
						? <PlusIcon />
						: <MinusIcon />
				}
			</div>
		</div>
		<div className="category">
			<span>
				{props.transaction.category}
			</span>
		</div>
		<div className="comment">
			<span>
				{props.transaction.comment}
			</span>
		</div>
		<div className={cx("amount", signClass)}>
			<span>
				{props.transaction.amount.format()}
			</span>
		</div>
	</div>
}