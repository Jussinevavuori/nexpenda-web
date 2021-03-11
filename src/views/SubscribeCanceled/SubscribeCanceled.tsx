import "./SubscribeCanceled.scss";
import React from "react";
import cx from "classnames";
import { useSubscribeCanceledController } from "./useSubscribeCanceledController";
import { Type } from "../../components/Type/Type";

export type SubscribeCanceledProps = {

};

export function SubscribeCanceled(props: SubscribeCanceledProps) {

	const controller = useSubscribeCanceledController(props)

	return <div className={cx("SubscribeCanceled")}>

	</div>
}