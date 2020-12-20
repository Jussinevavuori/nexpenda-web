import "./FiltersDrawer.scss";
import React from "react"
import { useMdMedia } from "../../hooks/useMedia";
import { Drawer } from "@material-ui/core";
import { FiltersForm } from "../FiltersForm/FiltersFormController";

export type FiltersDrawerViewProps = {
	open: boolean;
	onOpen(): void;
	onClose(): void;
}

export function FiltersDrawerView(props: FiltersDrawerViewProps) {

	const largerScreen = useMdMedia()

	return <Drawer
		className="FiltersDrawer"
		open={props.open}
		onClose={props.onClose}
		anchor={largerScreen ? "right" : "bottom"}
	>
		<div className="FiltersDrawer__Content">
			<FiltersForm onConfirm={props.onClose} />
		</div>
	</Drawer>
}