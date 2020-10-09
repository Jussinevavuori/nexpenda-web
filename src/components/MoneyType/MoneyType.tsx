import "./MoneyType.scss";
import React from "react"
import cx from "classnames"
import { MoneyAmount } from "../../classes/MoneyAmount";
import { Type, TypeProps } from "../Type/Type";

export type MoneyTypeProps = {
	amount: MoneyAmount;
	applyColor?: boolean;
	bold?: boolean;
} & TypeProps

export function MoneyType(props: MoneyTypeProps) {

	const {
		amount,
		applyColor,
		bold,
		...typeProps
	} = props

	return <span className={cx("MoneyType", {
		bold,
		applyColor,
		positive: props.amount.isNonNegative,
		negative: props.amount.isNegative,
	})}>
		<Type condensed {...typeProps} component="span">
			{amount.format()}
		</Type>
	</span >
}