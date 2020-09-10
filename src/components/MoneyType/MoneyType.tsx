import "./MoneyType.scss";
import React from "react"
import { MoneyAmount, MoneyAmountFormatOptions } from "../../utils/MoneyAmount";
import { Type, TypeProps } from "../Type/Type";

export type MoneyTypeProps = {
	amount: MoneyAmount;
	formatOptions?: Partial<MoneyAmountFormatOptions>;
} & TypeProps

export function MoneyType(props: MoneyTypeProps) {

	const { amount, formatOptions, ...typeProps } = props

	return <span className="MoneyType">
		<Type condensed {...typeProps} component="span">
			{amount.format(formatOptions)}
		</Type>
	</span >
}