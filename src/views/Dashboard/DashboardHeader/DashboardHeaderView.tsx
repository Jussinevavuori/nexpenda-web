import "./DashboardHeader.scss";
import React from "react"
import textureImg from "../../../images/shapelined-_JBKdviweXI-unsplash.jpg";
import { MoneyAmount } from "../../../classes/MoneyAmount";
import { useMdMedia } from "../../../hooks/useMedia";
import { Type } from "../../../components/Type/Type";
import { IconButton } from "@material-ui/core";
import { InsertChart, ExpandLess as IncomesIcon, ExpandMore as ExpensesIcon } from "@material-ui/icons";
import { MoneyType } from "../../../components/MoneyType/MoneyType";

export type DashboardHeaderViewProps = {
	intervalString: string;
	transactionsCount: number;
	transactionsTotal: MoneyAmount;
	transactionsTotalIncome: MoneyAmount;
	transactionsTotalExpense: MoneyAmount;
	isSelectionActive: boolean;
	selectionLength: number;
}

export function DashboardHeaderView(props: DashboardHeaderViewProps) {

	const desktopView = useMdMedia()


	/**
	 * Desktop view
	 */
	if (desktopView) {
		return <div className="DashboardHeader desktop">

			<div className="left">
				<div className="title">
					<Type component="h1" size="xl" color="gray-900" variant="bold">
						{"Your transactions"}
					</Type>
				</div>
				<div className="transactions-count">
					<Type size="md" color="gray-600" variant="boldcaps">
						{
							props.isSelectionActive
								? `Selected ${props.selectionLength} / ${props.transactionsCount} transactions`
								: `${props.transactionsCount} transactions`
						}
					</Type>
				</div>
			</div>

			<div className="right">
				<div className="total">
					<MoneyType
						animate
						colorIfPositive="green-600"
						colorIfNegative="red-600"
						amount={props.transactionsTotal}
						size="xl"
						variant="bold"
					/>
				</div>
				<div className="subtotals">
					<div>
						<IncomesIcon />
						<MoneyType
							animate
							color="gray-700"
							amount={props.transactionsTotalIncome}
							size="md"
							variant="regular"
						/>
					</div>
					<div>
						<ExpensesIcon />
						<MoneyType
							animate
							color="gray-700"
							amount={props.transactionsTotalExpense}
							size="md"
							variant="regular"
						/>
					</div>
				</div>
			</div>

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