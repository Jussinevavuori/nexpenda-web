import "./PremiumPricingOptions.scss";
import React from "react";
import cx from "classnames";
import { usePremiumPricingOptionsController } from "./usePremiumPricingOptionsController";
import { CircularProgress } from "@material-ui/core";
import { LocalOffer as DealIcon } from "@material-ui/icons"
import { Type } from "../Type/Type";
import { PremiumPrice } from "../../lib/DataModels/PremiumPrice";
import { createClassnames } from "../../lib/Utilities/createClassnames";

export type PremiumPricingOptionsProps = {

};

export function PremiumPricingOptions(props: PremiumPricingOptionsProps) {

	const controller = usePremiumPricingOptionsController(props)

	if (controller.prices.length === 0) {
		return <div className="PremiumPricingOptions__loading">
			<CircularProgress />
		</div>
	}

	return <ul className={cx("PremiumPricingOptions")}>


		{
			controller.prices.map((price, priceIndex) => {

				const _cx = createClassnames(priceIndex === 0 ? "primary" : "secondary")
				const savePercentages = price.getIsPercentagesCheaperThan(
					controller.prices[controller.prices.length - 1]
				)

				return <li className={_cx("pricingOption")}>

					<Type variant="bold">
						{price.nickname}
					</Type>

					<p className="price">
						<Type component="span" variant="bold" size="xl">
							{
								[
									((price.unitAmount ?? 0) / 100).toFixed(2),
									PremiumPrice.currencyToSymbol(price.currency)
								].join(" ")
							}
						</Type>
						{
							price.interval &&
							<Type component="span" >
								{` / ${price.interval.format()}`}
							</Type>
						}

						{
							savePercentages > 0 &&
							<span className="dealBadge">
								<DealIcon />
								<Type variant="bold" component="span">
									{`Save ${savePercentages.toFixed(0)}%`}
								</Type>
							</span>
						}
					</p>

					<button
						className={_cx("order")}
						onClick={controller.getOnSubscribeHandler(price)}
					>
						{"Select"}
					</button>

				</li>

			})
		}
	</ul>
}