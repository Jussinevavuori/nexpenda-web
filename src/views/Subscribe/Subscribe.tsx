import "./Subscribe.scss";
import React from "react";
import cx from "classnames";
import { useSubscribeController } from "./useSubscribeController";
import { Type } from "../../components/Type/Type";
import { SubscriptionProduct } from "../../components/SubscriptionProduct/SubscriptionProduct";
import { SubscriptionFrame } from "../../components/SubscriptionFrame/SubscriptionFrame";

export type SubscribeProps = {

};

export function Subscribe(props: SubscribeProps) {

	const controller = useSubscribeController(props)

	return <SubscriptionFrame
		className={cx("Subscribe")}

		headerContent={<div className="subscriptionHeader">
			<Type
				component="h1"
				color="white"
				variant="bold"
				size="xxl"
			>
				{"Become a premium member!"}
			</Type>

			<Type component="h2" color="white" >
				{"Get access to multiple premium-only features!"}
			</Type>
		</div>}
	>


		<ul className="features">
			<Type
				component="h3"
				variant="bold"
				size="lg"
			>
				{"All premium features"}
			</Type>

			<li className="feature">
				<Type component="h4" variant="bold">
					{"More customization options!"}
				</Type>
				<Type component="p">
					{"Get access to a wide variety of color options and "}
					{"make Nexpenda feel like your own!"}
				</Type>
			</li>

		</ul>

		<div className="products">
			<Type
				component="h3"
				variant="bold"
				size="lg"
			>
				{"Pricing options"}
			</Type>
			<ul>
				<SubscriptionProduct variant="month" />
				<SubscriptionProduct variant="year" />
			</ul>
		</div>


	</SubscriptionFrame>
}