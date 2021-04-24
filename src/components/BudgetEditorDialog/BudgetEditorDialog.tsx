import "./BudgetEditorDialog.scss";
import React from "react";
import cx from "classnames";
import { useBudgetEditorDialogController } from "./useBudgetEditorDialogController";
import { BudgetForm } from "../BudgetForm/BudgetForm";
import { DialogProps, DrawerProps } from "@material-ui/core";
import { ResponsiveDialog } from "../ResponsiveDialog/ResponsiveDialog";

export type BudgetEditorDialogProps = {
	DrawerProps?: DrawerProps;
	DialogProps?: DialogProps;
};

export function BudgetEditorDialog(props: BudgetEditorDialogProps) {

	const controller = useBudgetEditorDialogController(props)

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
			<div className={cx("BudgetEditorDialog", renderProps.variant)}>
				{
					controller.budget &&
					<BudgetForm
						onSubmitted={controller.handleClose}
						variant={{ edit: { budget: controller.budget } }}
					/>
				}
			</div>
		)}
	</ResponsiveDialog>
}