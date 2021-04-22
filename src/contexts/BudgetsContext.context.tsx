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
	const startDate = useStoreState(_ => _.interval.startDate)
	const endDate = useStoreState(_ => _.interval.endDate)

	const value = useMemo(() => {
		return calculateBudgets({
			transactions,
			budgets,
			interval: {
				start: startDate,
				end: endDate,
			}
		})
	}, [transactions, budgets, startDate, endDate])

	return <BudgetsContext.Provider value={value}>
		{props.children}
	</BudgetsContext.Provider>
}

function getDefaultBudgetsContextValue(): BudgetsContextType {
	return {
		budgetTotals: {
			income: {
				estimate: new MoneyAmount(0),
				progress: new MoneyAmount(0),
				percentage: 0,
			},
			expense: {
				estimate: new MoneyAmount(0),
				progress: new MoneyAmount(0),
				percentage: 0,
			},
			total: {
				estimate: new MoneyAmount(0),
				progress: new MoneyAmount(0),
				percentage: 0,
			}
		},
		extendedBudgets: [],
		data: {
			interval: {
				start: new Date(),
				end: new Date(),
			},
			budgets: [],
			transactions: [],
		}
	}
}