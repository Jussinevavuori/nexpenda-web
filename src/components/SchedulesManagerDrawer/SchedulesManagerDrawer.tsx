import "./SchedulesManagerDrawer.scss";
import React from "react";
import cx from "classnames";
import { useSchedulesManagerDrawerController } from "./useSchedulesManagerDrawerController";
import { Drawer, DrawerProps } from "@material-ui/core";
import { SchedulesManager } from "../SchedulesManager/SchedulesManager";

export type SchedulesManagerDrawerProps = {

} & Omit<DrawerProps, "open" | "onClose">;

export function SchedulesManagerDrawer(props: SchedulesManagerDrawerProps) {

	const controller = useSchedulesManagerDrawerController(props)

	return <Drawer
		anchor={controller.isDesktop ? "left" : "bottom"}
		{...props}
		className={cx("SchedulesManagerDrawer", props.className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<div className="SchedulesManagerDrawer__content">
			<SchedulesManager />
		</div>
	</Drawer>

}