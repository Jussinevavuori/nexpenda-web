import "./SubscriptionProduct.scss";
import React from "react";
import cx from "classnames";
import { useSubscriptionProductController } from "./useSubscriptionProductController";
import { Type } from "../Type/Type";
import { MoneyType } from "../MoneyType/MoneyType";

export type SubscriptionProductProps = {

	variant: "year" | "month"

};

export function SubscriptionProduct(props: SubscriptionProductProps) {

	const controller = useSubscriptionProductController(props)

	if (!controller.price || !controller.priceMoneyAmount || !controller.product) {
		return null
	}

	return <div className={cx("SubscriptionProduct")}>

		<Type>
			{controller.product.name}
		</Type>

		<MoneyType
			amount={controller.priceMoneyAmount}
			color={"primary-600"}
		/>

		<Type>
			{"/ " + props.variant}
		</Type>

		{
			props.variant === "year" && <Type>{"- 19%"}</Type>
		}

	</div>
}