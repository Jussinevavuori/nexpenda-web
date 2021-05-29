import "./AvatarChangerDialog.scss";
import React from "react";
import cx from "classnames";
import { useAvatarChangerDialogController } from "./useAvatarChangerDialogController";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@material-ui/core";
import { Type } from "../Type/Type";
import { AvatarChanger } from "../AvatarChanger/AvatarChanger";

export type AvatarChangerDialogProps = {

} & Omit<DialogProps, "open" | "onClose">;

export function AvatarChangerDialog(props: AvatarChangerDialogProps) {

	const controller = useAvatarChangerDialogController(props)

	return <Dialog
		{...props}
		className={cx("AvatarChangerDialog", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<DialogTitle>
			<Type variant="bold">
				{"Change your avatar"}
			</Type>
		</DialogTitle>
		<DialogContent>
			<AvatarChanger
				onSubmitted={controller.handleClose}
			/>
		</DialogContent>
		<DialogActions>
			<Button onClick={controller.handleClose}>{"Close"}</Button>
		</DialogActions>
	</Dialog>
}