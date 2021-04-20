import "./TransactionCreatorDrawer.scss";
import React from "react"
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { Drawer } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { useTransactionCreatorDrawerController } from "./useTransactionCreatorDrawerController";

export type TransactionCreatorDrawerProps = {}

export function TransactionCreatorDrawer(props: TransactionCreatorDrawerProps) {

	const largerScreen = useMdMedia()

	const controller = useTransactionCreatorDrawerController(props)

	return <Drawer
		className="TransactionCreatorDrawer"
		open={controller.open}
		onClose={controller.onClose}
		anchor={largerScreen ? "left" : "bottom"}
	>
		<div className="TransactionCreatorDrawer__Content">
			<TransactionForm onClose={controller.onClose} />
		</div>
	</Drawer>
}