import "./TransactionEditorDrawer.scss";
import React from "react"
import { Drawer } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { useTransactionEditorDrawerController } from "./useTransactionEditorDrawerController";

export type TransactionEditorDrawerProps = {
}

export function TransactionEditorDrawer(props: TransactionEditorDrawerProps) {

	const controller = useTransactionEditorDrawerController(props)

	const isLargerScreen = useMdMedia()

	return <Drawer
		className="TransactionEditorDrawer"
		open={!!controller.selectedItem}
		onClose={controller.onClose}
		anchor={isLargerScreen ? "left" : "bottom"}
	>
		<div className="TransactionEditorDrawer__content">
			<TransactionForm
				onClose={controller.onClose}
				editTransaction={controller.selectedItem}
			/>
		</div>
	</Drawer>
}