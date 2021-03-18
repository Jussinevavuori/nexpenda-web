import "./FeedbackDialog.scss";
import React from "react";
import cx from "classnames";
import { useFeedbackDialogController } from "./useFeedbackDialogController";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, TextField } from "@material-ui/core";
import { Type } from "../Type/Type";
import { Send as SendIcon } from "@material-ui/icons";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";

export type FeedbackDialogProps = {

} & Omit<DialogProps, "open" | "onClose">;

export function FeedbackDialog(props: FeedbackDialogProps) {

	const controller = useFeedbackDialogController(props)

	return <Dialog
		fullWidth
		maxWidth="sm"
		{...props}
		open={controller.isOpen}
		onClose={controller.handleClose}
		className={cx("FeedbackDialog", props.className)}
	>
		<form
			className="FeedbackDialog__form"
			onSubmit={controller.handleSubmit}
		>
			<DialogTitle>
				<Type variant="bold">
					{"Contact us"}
				</Type>
			</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					label="Message"
					variant="outlined"
					value={controller.message}
					onChange={e => controller.setMessage(e.target.value)}
					multiline
					rows={10}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={controller.handleClose}
					variant="text"
				>
					{"Close"}
				</Button>
				<EnhancedButton
					loading={controller.isLoading}
					onClick={controller.handleSubmit}
					disabled={!controller.message}
					color="primary"
					variant="contained"
					endIcon={<SendIcon />}
					type="submit"
				>
					{"Send"}
				</EnhancedButton>
			</DialogActions>
		</form>
	</Dialog>
}