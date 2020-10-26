import "./TransactionCreatorDrawer.scss";
import React from "react"
import { TransactionForm } from "../TransactionForm/TransactionFormController";
import { Drawer } from "@material-ui/core";
import { useSmMedia } from "../../hooks/useMedia";

export type TransactionCreatorDrawerViewProps = {
	open: boolean;
	onOpen(): void;
	onClose(): void;
}

export function TransactionCreatorDrawerView(props: TransactionCreatorDrawerViewProps) {

	const largerScreen = useSmMedia()

	return <Drawer
		className="TransactionCreatorDrawer"
		open={props.open}
		onClose={props.onClose}
		anchor={largerScreen ? "left" : "bottom"}
	>
		<TransactionForm
			onClose={props.onClose}
		/>
	</Drawer>
}