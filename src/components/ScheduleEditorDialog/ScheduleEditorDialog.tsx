import "./ScheduleEditorDialog.scss";
import React from "react";
import cx from "classnames";
import { useScheduleEditorDialogController } from "./useScheduleEditorDialogController";
import { ScheduleEditor } from "../ScheduleEditor/ScheduleEditor";
import { Dialog, DialogProps } from "@material-ui/core";

export type ScheduleEditorDialogProps = {

} & Omit<DialogProps, "open" | "onClose">;

export function ScheduleEditorDialog(props: ScheduleEditorDialogProps) {
	const controller = useScheduleEditorDialogController(props)

	return <Dialog
		maxWidth={false}
		{...props}
		className={cx("ScheduleEditorDialog", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		{
			controller.openedSchedule &&
			<div className="ScheduleEditorDialog__content">
				<ScheduleEditor
					schedule={controller.openedSchedule}
					onClose={controller.handleClose}
				/>
			</div>
		}
	</Dialog>
}