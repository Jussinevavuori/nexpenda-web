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
import { Button } from "@material-ui/core";
import { Add, Info } from "@material-ui/icons";
import { BetaFeatureBanner } from "../../components/BetaFeatureBanner/BetaFeatureBanner";
import { BudgetsOverview } from "../../components/BudgetsOverview/BudgetsOverview";

export type BudgetsProps = {

};

export function Budgets(props: BudgetsProps) {
	const controller = useBudgetsController(props)
	const isDesktop = useMdMedia()

	return <BudgetsContextProvider>
		<div className={cx("Budgets")}>

			<section className="headerSection">
				<BudgetsHeader />
				{
					!isDesktop && <div className="panelContainer">
						<BudgetsPanel />
					</div>
				}
			</section>


			<section className="overviewSection">
				<BetaFeatureBanner feature="Budgets" />
				<BudgetsOverview />
			</section>

			<section className="budgetsSection">
				<div className="budgetsList incomes">
					<div className="budgetsListHeader">
						<Type component="h2" variant="bold" color="gray-600">
							{"Incomes"}
						</Type>
						<Button startIcon={<Add />} onClick={controller.onCreateNewIncomeBudget}>
							{"Add"}
						</Button>
					</div>
					<ul>
						{
							controller.incomeBudgets.map(budget => {
								return <li key={budget.id}>
									<BudgetBlock budget={budget} />
								</li>
							})
						}
					</ul>
					{
						controller.incomeBudgets.length === 0 &&
						<div className="noBudgets income">
							<Type color="primary-600" variant="bold" className="title">
								<Info />
								{"What are income budgets?"}
							</Type>
							<Type color="gray-700">
								{"Income budgets are estimates of how much you earn on "}
								{"average per month. You should add your stable sources of "}
								{"income here to help you determine how much you can spend "}
								{"per month."}
							</Type>
							<Button
								className="addFirstBudget income"
								startIcon={<Add />}
								onClick={controller.onCreateNewIncomeBudget}
							>
								{"Add your first income budget"}
							</Button>
						</div>
					}
				</div>
				<div className="budgetsList expenses">
					<div className="budgetsListHeader">
						<Type component="h2" variant="bold" color="gray-600">
							{"Expenses"}
						</Type>
						<Button startIcon={<Add />} onClick={controller.onCreateNewExpenseBudget}>
							{"Add"}
						</Button>
					</div>
					<ul>
						{
							controller.expenseBudgets.map(budget => {
								return <li key={budget.id}>
									<BudgetBlock budget={budget} />
								</li>
							})
						}
					</ul>
					{
						controller.expenseBudgets.length === 0 &&
						<div className="noBudgets expense">
							<Type color="primary-600" variant="bold" className="title">
								<Info />
								{"What are expense budgets?"}
							</Type>
							<Type color="gray-700">
								{"Expense budgets are either estimates on how much you are "}
								{"spending on a category or limits to how much you at most "}
								{"want to spend on a category."}
							</Type>
							<Button
								className="addFirstBudget expense"
								startIcon={<Add />}
								onClick={controller.onCreateNewExpenseBudget}
							>
								{"Add your first expense budget"}
							</Button>
						</div>
					}
				</div>
			</section>
		</div>
	</BudgetsContextProvider>
}