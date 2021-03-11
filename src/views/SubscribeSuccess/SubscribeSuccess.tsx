import "./SubscribeSuccess.scss";
import React from "react";
import cx from "classnames";
import { SubscriptionFrame } from "../../components/SubscriptionFrame/SubscriptionFrame";
import { Type } from "../../components/Type/Type";
import { PremiumFeatures } from "../../components/PremiumFeatures/PremiumFeatures";
import { Button } from "@material-ui/core";
import { useSubscribeSuccessController } from "./useSubscribeSuccessController";

export type SubscribeSuccessProps = {

};

export function SubscribeSuccess(props: SubscribeSuccessProps) {

	const controller = useSubscribeSuccessController(props)

	return <SubscriptionFrame
		className={cx("SubscribeSuccess")}
		headerContent={<div className="subscriptionHeader">
			<Type
				component="h1"
				color="white"
				variant="bold"
				size="xxl"
			>
				{"Thank you for becoming a member!"}
			</Type>

			<Type component="h2" color="white" size="lg" >
				{"You now have access to all Nexpenda premium features!"}
			</Type>
		</div>}
	>

		<Type component="h3" variant="bold" size="lg">
			{"Check out your new features!"}
		</Type>
		<PremiumFeatures />

		<Button
			variant="contained"
			color="primary"
			size="large"
			fullWidth
			onClick={controller.onContinueToApp}
		>
			{"Continue using Nexpenda"}
		</Button>


	</SubscriptionFrame>
}