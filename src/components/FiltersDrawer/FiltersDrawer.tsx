import "./FiltersDrawer.scss";
import React from "react"
import { useMdMedia } from "../../hooks/useMedia";
import { Drawer } from "@material-ui/core";
import { FiltersForm } from "../FiltersForm/FiltersFormController";
import { useFiltersDrawerController } from "./useFiltersDrawerController";

export type FiltersDrawerProps = {

}

export function FiltersDrawer(props: FiltersDrawerProps) {

	const isLargerScreen = useMdMedia()

	const controller = useFiltersDrawerController(props)

	return <Drawer

		className="FiltersDrawer"
		open={controller.open}
		onClose={controller.onClose}
		anchor={isLargerScreen ? "right" : "bottom"}
	>
		<div className="FiltersDrawer__Content">
			<FiltersForm onConfirm={controller.onClose} />
		</div>
	</Drawer >
}