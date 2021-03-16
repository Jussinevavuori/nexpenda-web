import "./BudgetEditorDrawer.scss";
import React from "react";
import cx from "classnames";
import { useBudgetEditorDrawerController } from "./useBudgetEditorDrawerController";
import { BudgetForm } from "../BudgetForm/BudgetForm";
import { Drawer, DrawerProps } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type BudgetEditorDrawerProps = {
	DrawerProps?: DrawerProps;
};

export function BudgetEditorDrawer(props: BudgetEditorDrawerProps) {

	const controller = useBudgetEditorDrawerController(props)
	const isLargerScreen = useMdMedia()

	return <Drawer
		open={controller.isOpen}
		onClose={controller.handleClose}
		anchor={isLargerScreen ? "left" : "bottom"}
		{...props.DrawerProps}
	>
		<div className={cx("BudgetEditorDrawer")}>
			{
				controller.budget &&
				<BudgetForm
					onSubmitted={controller.handleClose}
					variant={{
						edit: {
							budget: controller.budget
						}
					}}
				/>
			}
		</div>
	</Drawer>
}