import "./Subscribe.scss";
import React from "react";
import cx from "classnames";
import { useSubscribeController } from "./useSubscribeController";
import { Type } from "../../components/Type/Type";
import { SubscriptionFrame } from "../../components/SubscriptionFrame/SubscriptionFrame";
import { PremiumFeatures } from "../../components/PremiumFeatures/PremiumFeatures";
import { PremiumPricingOptions } from "../../components/PremiumPricingOptions/PremiumPricingOptions";
import { ClearableErrorDialog } from "../../components/ClearableErrorDialog/ClearableErrorDialog";
import { Link } from "react-router-dom";
import { routes } from "../../Routes";
import { Button } from "@material-ui/core";

export type SubscribeProps = {
	cancelled?: boolean;
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
				{"Unlock the full potential of Nexpenda!"}
			</Type>
			<Type component="h2" color="white" size="lg" >
				{"Subscribe to Nexpenda Premium to get access to more features "}
				{"and unlimited everything!"}
			</Type>
		</div>}
	>

		<ClearableErrorDialog
			open={controller.isCanceled}
			onClose={controller.handleClearCanceled}
			title="Subscription checkout canceled"
		/>

		<Type component="h3" variant="bold" size="lg">
			{"All premium features"}
		</Type>
		<PremiumFeatures />


		{
			controller.isPremium
				? <>
					<Type component="h3" variant="bold" size="lg">
						{"You are already a Nexpenda premium user"}
					</Type>
					<Link to={routes.dashboard.path}>
						<Button color="primary" variant="contained">
							{"Go back"}
						</Button>
					</Link>
				</>
				: <>
					<Type component="h3" variant="bold" size="lg">
						{"Choose your price"}
					</Type>
					<PremiumPricingOptions />


					<Link to={routes.dashboard.path}>
						<Button color="primary" variant="text">
							{"Go back"}
						</Button>
					</Link>
				</>
		}

	</SubscriptionFrame>
}