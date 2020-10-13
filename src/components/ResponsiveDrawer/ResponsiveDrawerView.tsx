import "./ResponsiveDrawer.scss";
import React from "react"
import cx from "classnames"
import { ResponsiveDrawerProps } from "./ResponsiveDrawerController"
import { Drawer } from "@material-ui/core";
import { useSmMedia } from "../../hooks/useMedia";

export type ResponsiveDrawerViewProps = ResponsiveDrawerProps & {
}

export function ResponsiveDrawerView(props: ResponsiveDrawerViewProps) {

	const { children, ...propsWithoutChildren } = props

	const desktopLayout = useSmMedia()

	return <Drawer
		{...propsWithoutChildren}
		className={cx("ResponsiveDrawer", props.className)}
		anchor={desktopLayout ? props.anchor : "bottom"}
	>
		<div className="ResponsiveDrawerContent">
			{children}
		</div>
	</Drawer>
}