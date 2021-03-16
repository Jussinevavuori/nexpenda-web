import "./Budgets.scss";
import React from "react";
import cx from "classnames";
import { useBudgetsController } from "./useBudgetsController";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { BudgetsHeader } from "./BudgetsHeader/BudgetsHeader";
import { BudgetsPanel } from "./BudgetsPanel/BudgetsPanel";
import { BudgetsContextProvider } from "../../contexts/BudgetsContext.context";
import { Type } from "../../components/Type/Type";
import { BudgetBlock } from "../../components/BudgetBlock/BudgetBlock";

export type BudgetsProps = {

};

export function Budgets(props: BudgetsProps) {
	const controller = useBudgetsController(props)
	const isDesktop = useMdMedia()

	return <BudgetsContextProvider>
		<div className={cx("Budgets")}>
			<section className="headerContainer">
				<BudgetsHeader />
				{
					!isDesktop && <div className="panelContainer">
						<BudgetsPanel />
					</div>
				}
			</section>

			<section className="budgetsContainer">
				<div className="budgetsList incomes">
					<Type component="h2" variant="bold" color="gray-600">
						{"Incomes"}
					</Type>
					<ul>
						{
							controller.incomeBudgets.map(budget => {
								return <li key={budget.id}>
									<BudgetBlock budget={budget} />
								</li>
							})
						}
					</ul>
				</div>
				<div className="budgetsList expenses">
					<Type component="h2" variant="bold" color="gray-600">
						{"Expenses"}
					</Type>
					<ul>
						{
							controller.expenseBudgets.map(budget => {
								return <li key={budget.id}>
									<BudgetBlock budget={budget} />
								</li>
							})
						}
					</ul>
				</div>
			</section>
		</div>
	</BudgetsContextProvider>
}