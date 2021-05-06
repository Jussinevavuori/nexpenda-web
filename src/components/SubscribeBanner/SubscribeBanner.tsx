import "./SubscribeBanner.scss";
import React from "react";
import cx from "classnames";
import { Type } from "../Type/Type";
import { Button } from "@material-ui/core";
import { routes } from "../../Routes";
import { Link } from "react-router-dom";

export type SubscribeBannerProps = {
	onClose?(): void;
	title?: string;
};

export function SubscribeBanner(props: SubscribeBannerProps) {
	return <div className={cx("SubscribeBanner")}>

		<Type variant="bold" size="lg" color="white">
			{props.title || "Unlock the full potential of Nexpenda"}
		</Type>

		<Type color="white">
			{"Subscribe to Nexpenda Premium to get access to more features "}
			{"and unlimited everything!"}
		</Type>


		<Link to={routes.subscribe.path}>
			<Button
				className="primaryButton"
				variant="contained"
				fullWidth
			>
				{"Learn more"}
			</Button>
		</Link>

		{
			props.onClose &&
			<Button
				className="closeButton"
				variant="text"
				fullWidth
				onClick={props.onClose}
			>
				{"Close"}
			</Button>
		}


	</div>
}