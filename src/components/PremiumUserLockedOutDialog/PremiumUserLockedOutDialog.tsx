import "./PremiumUserLockedOutDialog.scss";
import React from "react";
import cx from "classnames";
import { usePremiumUserLockedOutDialogController } from "./usePremiumUserLockedOutDialogController";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogProps } from "@material-ui/core";
import { Type } from "../Type/Type";

export type PremiumUserLockedOutDialogProps = {

} & Omit<DialogProps, "handleClose" | "open">;

export function PremiumUserLockedOutDialog(props: PremiumUserLockedOutDialogProps) {
	const controller = usePremiumUserLockedOutDialogController(props)

	return <Dialog
		{...props}
		className={cx("PremiumUserLockedOutDialog", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<DialogTitle className={cx("PremiumUserLockedOutDialog__Title")}>
			<Type color="primary-600" variant="bold">
				{"This feature is only available for premium members!"}
			</Type>
		</DialogTitle>
		<DialogContent className={cx("PremiumUserLockedOutDialog__Content")}>
			<Type component="p">
				{"Become a Nexpenda premium member for only "}
			</Type>
			<div className="price">
				<Type center component="p">
					<Type center component="span" size="lg" color="primary-500" variant="bold">
						{"0,99 € "}
					</Type>
					<Type center component="span" color="gray-700">
						{"/ month"}
					</Type>
				</Type>
				<Type center component="p" color="gray-700" >
					{"or"}
				</Type>
				<Type center component="p">
					<Type center component="span" size="lg" color="primary-500" variant="bold">
						{"9,99 € "}
					</Type>
					<Type center component="span" color="gray-700">
						{"/ year"}
					</Type>
				</Type>
			</div>
			<Type component="p">
				{"to access this feature and much more!"}
			</Type>
			<Type component="p" style={{ marginTop: 20 }}>
				{"Premium members are currently not yet available."}
			</Type>
		</DialogContent>
		<DialogActions className={cx("PremiumUserLockedOutDialog__Actions")}>
			<Button disabled variant="contained" color="primary">
				{"Get premium"}
			</Button>
			<Button variant="outlined" onClick={controller.handleClose}>
				{"Close"}
			</Button>
		</DialogActions>
	</Dialog>
}