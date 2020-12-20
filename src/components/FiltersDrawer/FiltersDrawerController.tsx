import React from "react"
import { useHashOpenState } from "../../hooks/useHashOpenState"
import { FiltersDrawerView } from "./FiltersDrawerView"

export type FiltersDrawerProps = {

}

export const FiltersDrawerOpenHash = "filters"

export function useFiltersDrawerOpenState() {
	return useHashOpenState(FiltersDrawerOpenHash)
}

export function FiltersDrawer(props: FiltersDrawerProps) {

	const [open, setOpen] = useFiltersDrawerOpenState()

	return <FiltersDrawerView
		open={open}
		onOpen={() => setOpen(true)}
		onClose={() => setOpen(false)}
	/>
}