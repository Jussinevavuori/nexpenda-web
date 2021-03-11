import "./Subscribe.scss";
import React from "react";
import cx from "classnames";
// import { useSubscribeController } from "./useSubscribeController";
import { Type } from "../../components/Type/Type";
import { SubscriptionFrame } from "../../components/SubscriptionFrame/SubscriptionFrame";
import { PremiumFeatures } from "../../components/PremiumFeatures/PremiumFeatures";
import { PremiumPricingOptions } from "../../components/PremiumPricingOptions/PremiumPricingOptions";

export type SubscribeProps = {

};

export function Subscribe(props: SubscribeProps) {
	// const controller = useSubscribeController(props)

	return <SubscriptionFrame
		className={cx("Subscribe")}
		headerContent={<div className="subscriptionHeader">
			<Type
				component="h1"
				color="white"
				variant="bold"
				size="xxl"
			>
				{"Unlock the full potential of Nexpenda!"}
			</Type>
			<Type component="h2" color="white" size="lg" >
				{"Subscribe to Nexpenda Premium to get access to more features "}
				{"and unlimited everything!"}
			</Type>
		</div>}
	>
		<Type component="h3" variant="bold" size="lg">
			{"All premium features"}
		</Type>
		<PremiumFeatures />

		<Type component="h3" variant="bold" size="lg">
			{"Choose your price"}
		</Type>
		<PremiumPricingOptions />

	</SubscriptionFrame>
}