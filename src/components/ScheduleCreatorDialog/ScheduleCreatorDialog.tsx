import "./ScheduleCreatorDialog.scss";
import React from "react";
import cx from "classnames";
import { useScheduleCreatorDialogController } from "./useScheduleCreatorDialogController";
import { ScheduleCreator } from "../ScheduleCreator/ScheduleCreator";
import { Dialog, DialogProps } from "@material-ui/core";

export type ScheduleCreatorDialogProps = {

} & Omit<DialogProps, "open" | "onClose">;

export function ScheduleCreatorDialog(props: ScheduleCreatorDialogProps) {
	const controller = useScheduleCreatorDialogController(props)

	return <Dialog
		maxWidth={false}
		{...props}
		className={cx("ScheduleCreatorDialog", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<div className="ScheduleCreatorDialog__content">
			<ScheduleCreator onClose={controller.handleClose} />
		</div>
	</Dialog>
}