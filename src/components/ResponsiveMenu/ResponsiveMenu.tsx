import React from "react";
import cx from "classnames"
import { Drawer, DrawerProps, Menu, MenuProps } from "@material-ui/core";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type ResponsiveMenuRenderProps = { variant: "drawer" | "menu" }

export type ResponsiveMenuProps = {
	open: boolean,
	onClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void;
	className?: string;
	MenuProps?: Omit<MenuProps, "children" | "onClose" | "open">,
	DrawerProps?: Omit<DrawerProps, "children" | "onClose" | "open">,
	children?: React.ReactNode | ((renderProps: ResponsiveMenuRenderProps) => React.ReactNode);
}

export function ResponsiveMenu(props: ResponsiveMenuProps) {

	const shouldRenderMenu = useMdMedia()

	if (shouldRenderMenu) {
		return <Menu
			className={cx(
				props.className,
				props.MenuProps?.className,
				"ResponsiveMenu ResponsiveMenu__Menu"
			)}
			children={
				typeof props.children === "function"
					? props.children({ variant: "menu" })
					: props.children
			}
			open={props.open}
			onClose={props.onClose}
			{...props.MenuProps}
		/>
	} else {
		return <Drawer
			className={cx(
				props.className,
				props.DrawerProps?.className,
				"ResponsiveMenu ResponsiveMenu__Drawer"
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