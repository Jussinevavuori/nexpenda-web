import React from "react"
import { DashboardView } from "./DashboardView"
import { useStoreState } from "../../store";

export function Dashboard() {

	const user = useStoreState(_ => _.auth.user)

	const smartDisplayString = useStoreState(_ => _.interval.smartDisplayString)

	const filteredSums = useStoreState(_ => _.transactions.filtered.sums)

	if (!user) return null

	return <DashboardView

		intervalString={smartDisplayString}

		filteredSum={filteredSums.all}
		filteredIncomesSum={filteredSums.incomes}
		filteredExpensesSum={filteredSums.expenses}

		user={user}

	/>
}