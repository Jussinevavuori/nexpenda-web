import React, { useContext, useMemo } from "react";
import { MoneyAmount } from "../classes/MoneyAmount";
import { useStoreState } from "../store"
import { calculateBudgets } from "../utils/BudgetsUtils/calculateBudgets";

type BudgetsContextType = ReturnType<typeof calculateBudgets>

const BudgetsContext = React.createContext<BudgetsContextType>(getDefaultBudgetsContextValue())

export function useBudgetsContext() {
	return useContext(BudgetsContext)
}

export function BudgetsContextProvider(
	props: { children?: React.ReactNode }
) {
	const transactions = useStoreState(_ => _.transactions.items)
	const budgets = useStoreState(_ => _.budgets.items)
	const start = useStoreState(_ => _.interval.startDate)
	const end = useStoreState(_ => _.interval.endDate)

	const value = useMemo(() => calculateBudgets({
		transactions,
		budgets,
		interval: { start, end, }
	}), [transactions, budgets, start, end])

	return <BudgetsContext.Provider value={value}>
		{props.children}
	</BudgetsContext.Provider>
}

function getDefaultBudgetsContextValue(): BudgetsContextType {
	return {
		budgetTotals: {
			monthly: {
				income: {
					estimate: new MoneyAmount(-1),
					progress: new MoneyAmount(-1),
					percentage: -1,
				},
				expense: {
					estimate: new MoneyAmount(-1),
					progress: new MoneyAmount(-1),
					percentage: -1,
				},
			},
			absolute: {
				income: {
					estimate: new MoneyAmount(-1),
					progress: new MoneyAmount(-1),
					percentage: -1,
				},
				expense: {
					estimate: new MoneyAmount(-1),
					progress: new MoneyAmount(-1),
					percentage: -1,
				},
			},
			monthlyTotal: {
				estimate: new MoneyAmount(-1),
				progress: new MoneyAmount(-1),
				percentage: -1,
			},
			absoluteTotal: {
				estimate: new MoneyAmount(-1),
				progress: new MoneyAmount(-1),
				percentage: -1,
			},
		},
		extendedBudgets: [],
		data: {
			interval: {
				start: new Date(),
				end: new Date(),
			},
			intervalLengthInMonths: -1,
			budgets: [],
		}
	}
}