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

	const filtersActive = useStoreState(_ => _.filters.filtersActive)

	const handleSelectAll = useCallback(() => {
		selectAll(filteredTransactions.map(_ => _.id))
	}, [filteredTransactions, selectAll])

	return <DashboardView
		intervalString={smartDisplayString}

		filtersActive={filtersActive}

		user={user}

		selection={selection}
		selectionActive={selectionActive}
		onDeselectAll={() => deselectAll()}
		onSelectAll={handleSelectAll}
	/>
}