import "./TransactionEditorDrawer.scss";
import React from "react"
import { Drawer } from "@material-ui/core";
import { useSmMedia } from "../../hooks/useMedia";
import { Transaction } from "../../classes/Transaction";
import { TransactionForm } from "../TransactionForm/TransactionFormController";

export type TransactionEditorDrawerViewProps = {
	selectedItem?: Transaction;
	onOpen(id: string): void;
	onClose(): void;
}

export function TransactionEditorDrawerView(props: TransactionEditorDrawerViewProps) {

	const largerScreen = useSmMedia()

	return <Drawer
		className="TransactionEditorDrawer"
		open={!!props.selectedItem}
		onClose={props.onClose}
		anchor={largerScreen ? "left" : "bottom"}
	>
		<TransactionForm
			onClose={props.onClose}
			editTransaction={props.selectedItem}
		/>
	</Drawer>
}