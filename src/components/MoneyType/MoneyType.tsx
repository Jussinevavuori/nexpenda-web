import "./MoneyType.scss";
import React from "react"
import { MoneyAmount } from "../../utils/MoneyAmount";
import { Type, TypeProps } from "../Type/Type";

export type MoneyTypeProps = {
	amount: MoneyAmount;
} & TypeProps

export function MoneyType(props: MoneyTypeProps) {

	const { amount, ...typeProps } = props

	return <span className="MoneyType">
		<Type condensed {...typeProps} component="span">
			{amount.format()}
		</Type>
	</span >
}