import React from "react";
import cx from "classnames"
import { Drawer, DrawerProps, Dialog, DialogProps } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type ResponsiveDialogRenderProps = { variant: "drawer" | "dialog" }

export type ResponsiveDialogProps = {
	open: boolean,
	onClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void;
	className?: string;
	DialogProps?: Omit<DialogProps, "children" | "onClose" | "open">,
	DrawerProps?: Omit<DrawerProps, "children" | "onClose" | "open">,
	children?: React.ReactNode | ((renderProps: ResponsiveDialogRenderProps) => React.ReactNode);
}

export function ResponsiveDialog(props: ResponsiveDialogProps) {

	const shouldRenderDialog = useMdMedia()

	if (shouldRenderDialog) {
		return <Dialog
			className={cx(
				props.className,
				props.DialogProps?.className,
				"ResponsiveDialog ResponsiveDialog__Dialog"
			)}
			children={
				typeof props.children === "function"
					? props.children({ variant: "dialog" })
					: props.children
			}
			open={props.open}
			onClose={props.onClose}
			{...props.DialogProps}
		/>
	} else {
		return <Drawer
			className={cx(
				props.className,
				props.DrawerProps?.className,
				"ResponsiveDialog ResponsiveDialog__Drawer"
			)}
			children={
				typeof props.children === "function"
					? props.children({ variant: "drawer" })
					: props.children
			}
			open={props.open}
			onClose={props.onClose}
			anchor="bottom"
			{...props.DrawerProps}
		/>
	}

}