import "./BudgetCreatorDrawer.scss";
import React from "react";
import cx from "classnames";
import { useBudgetCreatorDrawerController } from "./useBudgetCreatorDrawerController";
import { BudgetForm } from "../BudgetForm/BudgetForm";
import { Drawer, DrawerProps } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type BudgetCreatorDrawerProps = {
	DrawerProps?: DrawerProps;
};

export function BudgetCreatorDrawer(props: BudgetCreatorDrawerProps) {

	const controller = useBudgetCreatorDrawerController(props)
	const isLargerScreen = useMdMedia()

	return <Drawer
		open={controller.isOpen}
		onClose={controller.handleClose}
		anchor={isLargerScreen ? "left" : "bottom"}
		{...props.DrawerProps}
	>
		<div className={cx("BudgetCreatorDrawer")}>
			{
				controller.variant &&
				<BudgetForm
					onSubmitted={controller.handleClose}
					variant={{
						create: {
							variant: controller.variant
						}
					}}
				/>
			}
		</div>
	</Drawer>
}