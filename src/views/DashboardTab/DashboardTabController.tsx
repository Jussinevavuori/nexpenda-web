import React from "react"
import { DashboardTabView } from "./DashboardTabView"
import { useStoreState, useStoreActions } from "../../store";

export function DashboardTab() {

	const user = useStoreState(_ => _.auth.user)

	const dateIntervalIsMonth = useStoreState(_ => _.transactions.interval.dateIntervalIsMonth)
	const dateIntervalMonthString = useStoreState(_ => _.transactions.interval.dateIntervalMonthString)

	const filteredSum = useStoreState(_ => _.transactions.filteredSum)
	const filteredIncomesSum = useStoreState(_ => _.transactions.filteredIncomesSum)
	const filteredExpensesSum = useStoreState(_ => _.transactions.filteredExpensesSum)

	const setNextMonthAsDateInterval = useStoreActions(_ => _.transactions.interval.setNextMonthAsDateInterval)
	const setPreviousMonthAsDateInterval = useStoreActions(_ => _.transactions.interval.setPreviousMonthAsDateInterval)

	if (!user) return null

	return <DashboardTabView

		dateIntervalIsMonth={dateIntervalIsMonth}
		dateIntervalMonthString={dateIntervalMonthString}

		setNextMonthAsDateInterval={() => setNextMonthAsDateInterval()}
		setPreviousMonthAsDateInterval={() => setPreviousMonthAsDateInterval()}

		filteredSum={filteredSum}
		filteredIncomesSum={filteredIncomesSum}
		filteredExpensesSum={filteredExpensesSum}

		user={user}

	/>
}