import "./Budget.scss";
import React from "react"
import { Type } from "../../components/Type/Type";

export type BudgetProps = {

}

export function Budget(props: BudgetProps) {
	return <div className="Budget">
		<div style={{
			width: "100%",
			padding: "4rem 0",
			display: "grid",
			placeItems: "center",
		}}>
			<Type>
				{"Budgets feature is coming here in a future version"}
			</Type>
		</div>
	</div>
}