import { useHashOpenState } from "../../hooks/useHashOpenState"
import { FiltersDrawerProps } from "./FiltersDrawer"


export const FiltersDrawerOpenHash = "filters"

export function useFiltersDrawerOpenState() {
	return useHashOpenState(FiltersDrawerOpenHash)
}

export function useFiltersDrawerController(props: FiltersDrawerProps) {

	const [open, setOpen] = useFiltersDrawerOpenState()

	return {
		open,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
	}
}