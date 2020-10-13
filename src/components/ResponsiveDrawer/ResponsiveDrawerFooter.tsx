import React from "react"

export type ResponsiveDrawerFooterProps = {
	children?: React.ReactNode;
}

export function ResponsiveDrawerFooter(props: ResponsiveDrawerFooterProps) {
	return <div className="ResponsiveDrawerFooter">
		{props.children}
	</div>
}