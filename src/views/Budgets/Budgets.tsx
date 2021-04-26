import "./Budgets.scss";
import React from "react";
import cx from "classnames";
import { useBudgetsController } from "./useBudgetsController";
import { BudgetsContextProvider } from "../../contexts/BudgetsContext.context";
import { Type } from "../../components/Type/Type";
import { BudgetBlock } from "../../components/BudgetBlock/BudgetBlock";
import { Button } from "@material-ui/core";
import { Add, Info } from "@material-ui/icons";
import { BetaFeatureBanner } from "../../components/BetaFeatureBanner/BetaFeatureBanner";
import { BudgetsOverview } from "../../components/BudgetsOverview/BudgetsOverview";
import { ContainerBlock } from "../../components/Container/ContainerBlock";
import { ViewContainer } from "../../components/ViewContainer/ViewContainer";
import { ViewHeader } from "../../components/ViewHeader/ViewHeader";
import { DefaultViewPanel } from "../../components/DefaultViewPanel/DefaultViewPanel";

export type BudgetsProps = {

};

export function Budgets(props: BudgetsProps) {
	const controller = useBudgetsController(props)

	return <BudgetsContextProvider>
		<ViewContainer
			scrollable
			viewHeader={<ViewHeader>{"Budgets"}</ViewHeader>}
			viewPanel={<DefaultViewPanel />}
		>
			<div className={cx("Budgets")}>
				<Type
					component="h2"
					variant="bold"
					size="xl"
					color="gray-900"
				>
					{`Budgets`}
				</Type>

				<BetaFeatureBanner feature="Budgets" />
				<BudgetsOverview />

				<ContainerBlock
					className="budgetsList incomes"
					containerTitle="Incomes"
				>
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
						</div>
					}
					<Button
						className="addBudget income"
						startIcon={<Add />}
						variant="outlined"
						color="primary"
						onClick={controller.onCreateNewIncomeBudget}
					>
						{"Add an income budget"}
					</Button>
				</ContainerBlock>
				<ContainerBlock
					className="budgetsList expenses"
					containerTitle="Expenses"
				>
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
						</div>
					}
					<Button
						className="addBudget expense"
						startIcon={<Add />}
						variant="outlined"
						color="primary"
						onClick={controller.onCreateNewExpenseBudget}
					>
						{"Add an expense budget"}
					</Button>
				</ContainerBlock>
			</div>
		</ViewContainer>
	</BudgetsContextProvider>
}