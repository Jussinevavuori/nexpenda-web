import React, { useContext, useMemo } from "react";
import { useStoreState } from "../store"
import { calculateAnalytics } from "../utils/AnalyticsUtils/calculateAnalytics"
import { Timerange } from "../utils/AnalyticsUtils/Timerange";

type AnalyticsContextType = ReturnType<typeof calculateAnalytics>

const AnalyticsContext = React.createContext<AnalyticsContextType>({
	base: Timerange.createTimeranges(new Date(), new Date(), new Date(), new Date()),
	categories: []
})

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
		return calculateAnalytics(transactions, categories, startDate, endDate)
	}, [transactions, categories, startDate, endDate])

	return <AnalyticsContext.Provider value={analytics}>
		{props.children}
	</AnalyticsContext.Provider>
}