import React from "react"

export type ResponsiveDrawerHeaderProps = {
	children?: React.ReactNode;
}

export function ResponsiveDrawerHeader(props: ResponsiveDrawerHeaderProps) {
	return <div className="ResponsiveDrawerHeader">
		{props.children}
	</div>
}