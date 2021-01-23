import { FiltersFormProps } from "./FiltersForm"
import { useStoreActions, useStoreState } from "../../store"

export function useFiltersFormController(props: FiltersFormProps) {

	const resetAllFilters = useStoreActions(_ => _.filters.resetAll)
	const resetSearchTermFilter = useStoreActions(_ => _.filters.resetSearchTerm)
	const resetAmountFilter = useStoreActions(_ => _.filters.resetAmount)
	const searchTermFilter = useStoreState(_ => _.filters.searchTerm)
	const setSearchTermFilter = useStoreActions(_ => _.filters.setSearchTerm)

	return {
		searchTermFilter: searchTermFilter,
		onResetAll() {
			resetAllFilters()
			if (props.onConfirm) {
				props.onConfirm()
			}
		},
		onResetSearchTermFilter() { resetSearchTermFilter() },
		onResetAmountFilter() { resetAmountFilter() },
		setSearchTermFilter(value: string) { setSearchTermFilter(value) }
	}
}