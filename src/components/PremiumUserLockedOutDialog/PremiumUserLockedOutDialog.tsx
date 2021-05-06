import "./PremiumUserLockedOutDialog.scss";
import React from "react";
import cx from "classnames";
import { usePremiumUserLockedOutDialogController } from "./usePremiumUserLockedOutDialogController";
import { Dialog, DialogProps } from "@material-ui/core";
import { SubscribeBanner } from "../SubscribeBanner/SubscribeBanner";

export type PremiumUserLockedOutDialogProps = {

} & Omit<DialogProps, "handleClose" | "open">;

/**
 * @todo Darkmode
 */

export function PremiumUserLockedOutDialog(props: PremiumUserLockedOutDialogProps) {
	const controller = usePremiumUserLockedOutDialogController(props)

	return <Dialog
		{...props}
		className={cx("PremiumUserLockedOutDialog", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<SubscribeBanner
			title={"This feature is only available for premium users"}
			onClose={controller.handleClose}
		/>
	</Dialog>
}