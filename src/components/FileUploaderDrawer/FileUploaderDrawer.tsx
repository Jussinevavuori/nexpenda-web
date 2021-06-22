import "./FileUploaderDrawer.scss";
import React from "react";
import cx from "classnames";
import { useFileUploaderDrawerController } from "./useFileUploaderDrawerController";
import { Drawer, DrawerProps } from "@material-ui/core";
import { FileUploader } from "../FileUploader/FileUploader";

export type FileUploaderDrawerProps = {

} & Omit<DrawerProps, "open" | "onClose">;

export function FileUploaderDrawer(props: FileUploaderDrawerProps) {
	const controller = useFileUploaderDrawerController(props)

	return <Drawer
		anchor={controller.isDesktop ? "left" : "bottom"}
		{...props}
		className={cx("FileUploaderDrawer", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<div className="FileUploaderDrawer__content">
			<FileUploader onFinished={controller.handleClose} />
		</div>
	</Drawer>
}