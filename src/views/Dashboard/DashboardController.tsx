import React, { useCallback } from "react"
import { DashboardView } from "./DashboardView"
import { useStoreActions, useStoreState } from "../../store";

export function Dashboard() {

	const user = useStoreState(_ => _.auth.user)

	const smartDisplayString = useStoreState(_ => _.interval.smartDisplayString)

	const filteredTransactions = useStoreState(_ => _.transactions.filtered.items)

	const selectionActive = useStoreState(_ => _.selection.selectionActive)
	const selection = useStoreState(_ => _.selection.selection)
	const selectAll = useStoreActions(_ => _.selection.selectAll)
	const deselectAll = useStoreActions(_ => _.selection.deselectAll)

	const handleSelectAll = useCallback(() => {
		selectAll(filteredTransactions.map(_ => _.id))
	}, [filteredTransactions, selectAll])

	if (!user) return null
	return <DashboardView
		intervalString={smartDisplayString}

		user={user}

		selection={selection}
		selectionActive={selectionActive}
		onDeselectAll={() => deselectAll()}
		onSelectAll={handleSelectAll}
	/>
}