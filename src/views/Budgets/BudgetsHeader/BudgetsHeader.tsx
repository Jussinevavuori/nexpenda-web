import "./BudgetsHeader.scss";
import React from "react";
import textureImg from "../../../images/shapelined-_JBKdviweXI-unsplash.jpg";
import cx from "classnames";
// import { useBudgetsHeaderController } from "./useBudgetsHeaderController";
import { useMdMedia } from "../../../hooks/utils/useMedia";
import { Type } from "../../../components/Type/Type";

export type BudgetsHeaderProps = {

};

export function BudgetsHeader(props: BudgetsHeaderProps) {

	// const controller = useBudgetsHeaderController(props)

	const isDesktop = useMdMedia()

	if (isDesktop) {
		return <header className={cx("BudgetsHeader", "desktop")}>

			<div className="title">
				<Type component="h1" size="xl" color="gray-900" variant="bold">
					{"Budgets"}
				</Type>
			</div>

		</header>
	}

	else {

		return <header className={cx("BudgetsHeader", "mobile")}>

			<div className="texture-image-container">
				<img src={textureImg} alt="" />
			</div>

			<div className="title">
				<Type component="h1" size="xl" color="white" variant="bold">
					{"Budgets"}
				</Type>
			</div>

		</header>

	}
}