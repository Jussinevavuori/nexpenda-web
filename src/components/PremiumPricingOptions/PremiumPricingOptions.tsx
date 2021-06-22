import "./PremiumPricingOptions.scss";
import React from "react";
import cx from "classnames";
import { usePremiumPricingOptionsController } from "./usePremiumPricingOptionsController";
import { CircularProgress } from "@material-ui/core";
import { LocalOffer as DealIcon } from "@material-ui/icons"
import { Type } from "../Type/Type";
import { StripeProduct } from "../../lib/Stripe/StripeProduct";

export type PremiumPricingOptionsProps = {

};

export function PremiumPricingOptions(props: PremiumPricingOptionsProps) {

	const controller = usePremiumPricingOptionsController(props)

	if (!controller.product || !controller.product.yearlyPrice || !controller.product.monthlyPrice) {
		return <div className="PremiumPricingOptions__loading">
			<CircularProgress />
		</div>
	}

	return <ul className={cx("PremiumPricingOptions")}>
		<li className="pricingOption yearly">

			<Type variant="bold">
				{"Yearly Premium subscription"}
			</Type>

			<p className="price">
				<Type component="span" variant="bold" size="xl">
					{(controller.product.yearlyPrice.unit_amount / 100).toFixed(2)}
					{" "}
					{StripeProduct.currencyToSymbol(controller.product.yearlyPrice.currency)}
				</Type>
				<Type component="span" >
					{" / year"}
				</Type>

				<span className="dealBadge">
					<DealIcon />
					<Type variant="bold" component="span">
						{"Save "}
						{controller.percentageYearlyCheaperThanMonthly}
					</Type>
				</span>
			</p>

			<button
				className="order yearly"
				onClick={controller.getOnSubscribeHandler("yearly")}
			>
				{"Select"}
			</button>
		</li>

		<li className="pricingOption monthly">

			<Type variant="bold">
				{"Monthly Premium subscription"}
			</Type>

			<p className="price">
				<Type component="span" variant="bold" size="xl">
					{(controller.product.monthlyPrice.unit_amount / 100).toFixed(2)}
					{" "}
					{StripeProduct.currencyToSymbol(controller.product.monthlyPrice.currency)}
				</Type>
				<Type component="span" >
					{" / month"}
				</Type>
			</p>

			<button
				className="order monthly"
				onClick={controller.getOnSubscribeHandler("monthly")}
			>
				{"Select"}
			</button>

		</li>
	</ul>
}