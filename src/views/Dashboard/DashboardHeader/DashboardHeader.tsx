import "./DashboardHeader.scss";
import React from "react"
import textureImg from "../../../images/shapelined-_JBKdviweXI-unsplash.jpg";
import { useMdMedia } from "../../../hooks/utils/useMedia";
import { Type } from "../../../components/Type/Type";
import { ExpandLess as IncomesIcon, ExpandMore as ExpensesIcon } from "@material-ui/icons";
import { MoneyType } from "../../../components/MoneyType/MoneyType";
import { useDashboardHeaderController } from "./useDashboardHeaderController";

export type DashboardHeaderProps = {
}

export function DashboardHeader(props: DashboardHeaderProps) {

	const desktopView = useMdMedia()

	const controller = useDashboardHeaderController(props)


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
							controller.isSelectionActive
								? `Selected ${controller.selectionLength} / ${controller.transactionsCount} transactions`
								: `${controller.transactionsCount} transactions`
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
						amount={controller.transactionsTotal}
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
							amount={controller.transactionsTotalIncome}
							size="md"
							variant="regular"
						/>
					</div>
					<div>
						<ExpensesIcon />
						<MoneyType
							animate
							color="gray-700"
							amount={controller.transactionsTotalExpense}
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
						{`${controller.transactionsCount} transactions`}
					</Type>
					<Type variant="boldcaps" size="sm" color="primary-300">
						{controller.intervalString}
					</Type>

				</section>

				<section className="analytics">

					<MoneyType
						size="xxl"
						color="white"
						amount={controller.transactionsTotal}
						animate
					/>

				</section>

			</div>

		</div>
	}
}