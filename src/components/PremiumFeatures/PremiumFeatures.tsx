import "./PremiumFeatures.scss";
import React from "react";
import cx from "classnames";
import { Type } from "../../components/Type/Type";
import { CheckCircleOutline as FeatureIcon } from "@material-ui/icons"

// import { usePremiumFeaturesController } from "./usePremiumFeaturesController";


export type PremiumFeaturesProps = {
	variant?: "condensed" | "default"
	condensed?: boolean;
	color?: "white" | "default"
};

export function PremiumFeatures(props: PremiumFeaturesProps) {

	// const controller = usePremiumFeaturesController(props)

	return <ul className={cx(
		"PremiumFeatures",
		`variant-${props.variant ?? "default"}`,
		`color-${props.color ?? "default"}`
	)}>

		<li className="feature analytics">
			<FeatureIcon />
			<Type
				component="h4"
				variant="bold"
				color={props.color === "white" ? "white" : undefined}
			>
				{"Unlimited transactions"}
			</Type>
			{
				props.variant !== "condensed" &&
				<Type component="p" color={props.color === "white" ? "white" : undefined}>
					{"Break all limits and use the app as much as you'd like. "}
					{"With Nexpenda Premium there are no limits to how many "}
					{"transactions you can create."}
				</Type>
			}
		</li>

		<li className="feature budgets">
			<FeatureIcon />
			<Type
				component="h4"
				variant="bold"
				color={props.color === "white" ? "white" : undefined}
			>
				{"Unlimited budgets"}
			</Type>
			{
				props.variant !== "condensed" &&
				<Type component="p" color={props.color === "white" ? "white" : undefined}>
					{"Stay on top of your spending with unlimited budgets. "}
					{"Nexpenda Premium will allow you to create and track as "}
					{"many budgets as you could ever want!"}
				</Type>
			}
		</li>

		<li className="feature analytics">
			<FeatureIcon />
			<Type
				component="h4"
				variant="bold"
				color={props.color === "white" ? "white" : undefined}
			>
				{"Full analytics"}
				<Type component="span">
					{" (Upcoming)"}
				</Type>
			</Type>
			{
				props.variant !== "condensed" &&
				<Type component="p" color={props.color === "white" ? "white" : undefined}>
					{"Utilize the full power of Nexpenda and unlock "}
					{"smarter, better and more analytics to help you "}
					{"gain insights into your spending habits!"}
				</Type>
			}
		</li>

		<li className="feature customization">
			<FeatureIcon />
			<Type
				component="h4"
				variant="bold"
				color={props.color === "white" ? "white" : undefined}
			>
				{"More customization options"}
			</Type>
			{
				props.variant !== "condensed" &&
				<Type component="p" color={props.color === "white" ? "white" : undefined}>
					{"Get access to a wide variety of color options and "}
					{"make Nexpenda feel like your own!"}
				</Type>
			}
		</li>

	</ul>
}