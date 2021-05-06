import "./FreemiumTrackerDialog.scss";
import React from "react";
import cx from "classnames";
import { useFreemiumTrackerDialogController } from "./useFreemiumTrackerDialogController";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@material-ui/core";
import { FreemiumTracker } from "../FreemiumTracker/FreemiumTracker";
import { Star } from "@material-ui/icons";
import { Type } from "../Type/Type";

export type FreemiumTrackerDialogProps = {

} & Omit<DialogProps, "open" | "onClose">;


export function FreemiumTrackerDialog(props: FreemiumTrackerDialogProps) {

	const controller = useFreemiumTrackerDialogController(props)

	return <Dialog
		fullWidth
		maxWidth="sm"
		{...props}
		open={controller.isOpen}
		onClose={controller.handleClose}
		className={cx("FreemiumTrackerDialog", props.className)}
	>
		<DialogTitle>
			<Type variant="bold">
				{"Free limits"}
			</Type>
		</DialogTitle>
		<DialogContent>
			<Type>
				{`You have ${controller.config.freeTransactionsLimit} free transactions `}
				{`and ${controller.config.freeBudgetsLimit} free budgets. In order to `}
				{`create more transactions and budgets, upgrade to Nexpenda premium.`}
			</Type>
			<FreemiumTracker
				hideUpgradeButton
				size="full"
			/>
		</DialogContent>
		<DialogActions>
			<Button
				onClick={controller.handleUpgrade}
				variant="contained"
				color="primary"
				startIcon={<Star />}
			>
				{"Upgrade"}
			</Button>
			<Button
				onClick={controller.handleClose}
				variant="text"
			>
				{"Close"}
			</Button>
		</DialogActions>
	</Dialog >
}