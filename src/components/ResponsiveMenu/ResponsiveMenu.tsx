import React from "react";
import cx from "classnames"
import { Drawer, DrawerProps, Menu, MenuProps } from "@material-ui/core";
import { useMdMedia } from "../../hooks/useMedia";

export type ResponsiveMenuProps = {
	open: boolean,
	onClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void;
	className?: string;
	MenuProps?: Omit<MenuProps, "children" | "onClose" | "open">,
	DrawerProps?: Omit<DrawerProps, "children" | "onClose" | "open">,
	children?: React.ReactNode
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
			open={props.open}
			onClose={props.onClose}
			children={props.children}
			{...{
				...props.MenuProps
			}}
		/>
	} else {
		return <Drawer
			className={cx(
				props.className,
				props.DrawerProps?.className,
				"ResponsiveMenu ResponsiveMenu__Drawer"
			)}
			open={props.open}
			onClose={props.onClose}
			children={props.children}
			{...{
				anchor: "bottom",
				...props.DrawerProps
			}}
		/>
	}

}