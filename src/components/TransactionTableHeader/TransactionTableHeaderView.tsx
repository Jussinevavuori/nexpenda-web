import "./TransactionTableHeader.scss";
import React from "react"
import { Type } from "../Type/Type";

export type TransactionTableHeaderViewProps = {

}

export function TransactionTableHeaderView(props: TransactionTableHeaderViewProps) {
	return <div className="TransactionTableHeader">
		<div className="amount">
			<Type>
				{"Määrä"}
			</Type>
		</div>
		<div className="category">
			<Type>
				{"Kategoria"}
			</Type>
		</div>
		<div className="comment">
			<Type>
				{"Kommentti"}
			</Type>
		</div>
		<div className="date">
			<Type>
				{"Päiväys"}
			</Type>
		</div>
		<div className="actions">
		</div>
	</div>
}