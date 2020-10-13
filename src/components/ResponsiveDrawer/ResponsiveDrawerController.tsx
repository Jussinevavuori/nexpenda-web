import { DrawerProps } from "@material-ui/core"
import React from "react"
import { ResponsiveDrawerView } from "./ResponsiveDrawerView"

export type ResponsiveDrawerProps = {
	children?: React.ReactNode;
} & DrawerProps

export function ResponsiveDrawer(props: ResponsiveDrawerProps) {
	return <ResponsiveDrawerView
		{...props}
	/>
}