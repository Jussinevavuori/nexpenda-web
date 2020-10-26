import React, { useMemo } from "react"
import { useTotalCalculations } from "../../hooks/useCalculations"
import { useStoreState } from "../../store"
import { QuickAnalyticsView } from "./QuickAnalyticsView"

export type QuickAnalyticsProps = {

}

export function QuickAnalytics(props: QuickAnalyticsProps) {

	const items = useStoreState(_ => _.transactions.filtered.items)

	const incomesOnlyItems = useMemo(() => items.filter(_ => _.amount.isPositive), [items])
	const expensesOnlyItems = useMemo(() => items.filter(_ => _.amount.isNegative), [items])

	const totalAll = useTotalCalculations(items);
	const totalIncomesOnly = useTotalCalculations(incomesOnlyItems);
	const totalExpensesOnly = useTotalCalculations(expensesOnlyItems);

	return <QuickAnalyticsView
		totalAll={totalAll}
		totalIncomesOnly={totalIncomesOnly}
		totalExpensesOnly={totalExpensesOnly}
	/>
}