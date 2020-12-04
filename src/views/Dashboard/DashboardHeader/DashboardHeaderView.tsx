import "./DashboardHeader.scss";
import React from "react"
import textureImg from "../../../images/shapelined-_JBKdviweXI-unsplash.jpg";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { useMdMedia } from "../../../hooks/useMedia";
import { Type } from "../../../components/Type/Type";
import { IconButton } from "@material-ui/core";
import { InsertChart } from "@material-ui/icons";
import { MoneyType } from "../../../components/MoneyType/MoneyType";

export type DashboardHeaderViewProps = {
	intervalString: string;
	transactionsCount: number;
	transactionsTotal: MoneyAmount;
	transactionsTotalIncome: MoneyAmount;
	transactionsTotalExpense: MoneyAmount;
}

export function DashboardHeaderView(props: DashboardHeaderViewProps) {

	const desktopView = useMdMedia()


	/**
	 * Desktop view
	 */
	if (desktopView) {
		return <div className="DashboardHeader desktop">


		</div>
	}

	/**
	 * Mobile view
	 */
	else {
		return <div className="DashboardHeader mobile">

			<div className="texture-image-container">
				<img src={textureImg} alt="" />
			</div>

			<div className="content">

				<section className="title">

					<Type variant="boldcaps" size="sm" color="white">
						{`${props.transactionsCount} transactions`}
					</Type>
					<Type variant="boldcaps" size="sm" color="blue-300">
						{props.intervalString}
					</Type>

				</section>

				<section className="analytics">

					<MoneyType
						size="xxl"
						color="white"
						amount={props.transactionsTotal}
						animate
					/>

					<IconButton>
						<InsertChart />
					</IconButton>

				</section>

			</div>

		</div>
	}
}