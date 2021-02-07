import React, { useContext, useMemo } from "react";
import { useStoreState } from "../store"
import { calculateAnalytics } from "../utils/AnalyticsUtils/calculateAnalytics"

type AnalyticsContextType = ReturnType<typeof calculateAnalytics>

const AnalyticsContext = React.createContext<AnalyticsContextType>(getDefaultAnalyticsContextValue())

export function useAnalyticsContext() {
	return useContext(AnalyticsContext)
}

export function AnalyticsContextProvider(
	props: { children?: React.ReactNode }
) {
	const transactions = useStoreState(_ => _.transactions.items)
	const categories = useStoreState(_ => _.transactions.categories)
	const startDate = useStoreState(_ => _.interval.startDate)
	const endDate = useStoreState(_ => _.interval.endDate)

	const analytics = useMemo(() => {
		return calculateAnalytics({
			transactions,
			categories,
			interval: {
				start: startDate,
				end: endDate,
			}
		})
	}, [transactions, categories, startDate, endDate])

	return <AnalyticsContext.Provider value={analytics}>
		{props.children}
	</AnalyticsContext.Provider>
}

function getDefaultAnalyticsContextValue(): AnalyticsContextType {
	return {
		allTime: {
			months: {},
			total: {
				total: 0,
				incomes: 0,
				expenses: 0,
			}
		},
		pastYear: {
			categories: {
				incomes: {},
				expenses: {},
				max: {
					expenses: 0,
					incomes: 0,
				}
			},
			endingMonth: new Date(),
			startingMonth: new Date(),
			monthsCount: 0,
			total: {
				transactionsAverage: 0,
				transactions: 0,
				total: 0,
				incomesAverage: 0,
				incomes: 0,
				expensesAverage: 0,
				expenses: 0,
				average: 0,
			}
		},
		selected: {
			categories: {
				incomes: {},
				expenses: {},
				max: {
					incomes: 0,
					expenses: 0,
				}
			},
			total: {
				expenses: 0,
				incomes: 0,
				transactions: 0,
				total: 0,
			}
		},
	}
}