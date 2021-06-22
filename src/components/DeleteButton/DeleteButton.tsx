import "./DeleteButton.scss";
import React from "react";
import cx from "classnames";
import { useDeleteButtonController } from "./useDeleteButtonController";
import { EnhancedButton, EnhancedButtonProps } from "../EnhancedButton/EnhancedButton";
import { Delete } from "@material-ui/icons";

export type DeleteButtonProps = {
	onConfirm?(): any | Promise<any>;
	activeTimeoutMs?: number;
	activeProps?: EnhancedButtonProps;
	inactiveProps?: EnhancedButtonProps;
	deleteLabel?: string;
	confirmLabel?: string;
	deletingLabel?: string;
} & Omit<EnhancedButtonProps, "onClick">;

export function DeleteButton(props: DeleteButtonProps) {
	const controller = useDeleteButtonController(props)

	return <EnhancedButton
		className={cx("DeleteButton", { active: controller.isActivated }, props.className)}
		startIcon={<Delete />}
		variant={controller.isActivated ? "contained" : "outlined"}
		{...controller.EnhancedButtonProps}
		{...(controller.isActivated ? props.activeProps : props.inactiveProps)}
		onClick={controller.onClick}
		loading={controller.EnhancedButtonProps.loading || controller.isDeleting}
	>
		{
			controller.isDeleting
				? props.deletingLabel ?? "Deleting..."
				: controller.isActivated
					? props.confirmLabel ?? "Confirm"
					: props.deleteLabel ?? "Delete"
		}
	</EnhancedButton>
}