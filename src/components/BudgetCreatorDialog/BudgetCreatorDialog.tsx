import "./BudgetCreatorDialog.scss";
import React from "react";
import cx from "classnames";
import { useBudgetCreatorDialogController } from "./useBudgetCreatorDialogController";
import { BudgetForm } from "../BudgetForm/BudgetForm";
import { DialogProps, DrawerProps } from "@material-ui/core";
import { ResponsiveDialog } from "../ResponsiveDialog/ResponsiveDialog";

export type BudgetCreatorDialogProps = {
	DrawerProps?: DrawerProps;
	DialogProps?: DialogProps;
};

export function BudgetCreatorDialog(props: BudgetCreatorDialogProps) {

	const controller = useBudgetCreatorDialogController(props)

	return <ResponsiveDialog
		open={controller.isOpen}
		onClose={controller.handleClose}
		DialogProps={{
			fullWidth: true,
			maxWidth: "sm",
			...props.DialogProps
		}}
		DrawerProps={props.DrawerProps}
	>
		{(renderProps) => (
			<div className={cx("BudgetCreatorDialog", renderProps.variant)}>
				{
					controller.variant &&
					<BudgetForm
						onSubmitted={controller.handleClose}
						variant={{ create: { variant: controller.variant } }}
					/>
				}
			</div>
		)}
	</ResponsiveDialog>
}