import React from "react"
import { DashboardTabView } from "./DashboardTabView"
import { useStoreState, useStoreActions } from "../../store";

export function DashboardTab() {

	const user = useStoreState(_ => _.auth.user)

	const dateIntervalIsMonth = useStoreState(_ => _.interval.dateIntervalIsMonth)
	const dateIntervalMonthString = useStoreState(_ => _.interval.dateIntervalMonthString)

	const filteredSums = useStoreState(_ => _.transactions.filtered.sums)

	const setNextMonthAsDateInterval = useStoreActions(_ => _.interval.setNextMonthAsDateInterval)
	const setPreviousMonthAsDateInterval = useStoreActions(_ => _.interval.setPreviousMonthAsDateInterval)

	if (!user) return null

	return <DashboardTabView

		dateIntervalIsMonth={dateIntervalIsMonth}
		dateIntervalMonthString={dateIntervalMonthString}

		setNextMonthAsDateInterval={() => setNextMonthAsDateInterval()}
		setPreviousMonthAsDateInterval={() => setPreviousMonthAsDateInterval()}

		filteredSum={filteredSums.all}
		filteredIncomesSum={filteredSums.incomes}
		filteredExpensesSum={filteredSums.expenses}

		user={user}

	/>
}