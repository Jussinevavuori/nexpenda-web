import React from "react"
import { Transaction } from "../../classes/Transaction"
import { TransactionTableRowView } from "./TransactionTableRowView"

export type TransactionTableRowProps = {
	transaction: Transaction;
}

export function TransactionTableRow(props: TransactionTableRowProps) {
	return <TransactionTableRowView
		transaction={props.transaction}
	/>
}