import "./PremiumFeatures.scss";
import React from "react";
import cx from "classnames";
import { Type } from "../../components/Type/Type";
import { CheckCircleOutline as FeatureIcon } from "@material-ui/icons"

// import { usePremiumFeaturesController } from "./usePremiumFeaturesController";


export type PremiumFeaturesProps = {

};

export function PremiumFeatures(props: PremiumFeaturesProps) {

	// const controller = usePremiumFeaturesController(props)

	return <ul className={cx("PremiumFeatures")}>

		<li className="feature analytics">
			<FeatureIcon />
			<Type component="h4" variant="bold">
				{"Unlimited transactions"}
			</Type>
			<Type component="p">
				{"Break all limits and use the app as much as you'd like. "}
				{"With Nexpenda Premium there are no limits to how many "}
				{"transactions you can create."}
			</Type>
		</li>

		<li className="feature budgets">
			<FeatureIcon />
			<Type component="h4" variant="bold">
				{"Unlimited budgets"}
			</Type>
			<Type component="p">
				{"Stay on top of your spending with unlimited budgets. "}
				{"Nexpenda Premium will allow you to create and track as "}
				{"many budgets as you could ever want!"}
			</Type>
		</li>

		<li className="feature analytics">
			<FeatureIcon />
			<Type component="h4" variant="bold">
				{"Full analytics"}
			</Type>
			<Type component="p">
				{"Utilize the full power of Nexpenda and unlock "}
				{"smarter, better and more analytics to help you "}
				{"gain insights into your spending habits!"}
			</Type>
		</li>

		<li className="feature customization">
			<FeatureIcon />
			<Type component="h4" variant="bold">
				{"More customization options"}
			</Type>
			<Type component="p">
				{"Get access to a wide variety of color options and "}
				{"make Nexpenda feel like your own!"}
			</Type>

		</li>

	</ul>
}