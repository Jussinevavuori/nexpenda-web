import React from "react"
import { AppFrameView } from "./AppFrameView"

export type AppFrameProps = {
	children: React.ReactNode;
}

export function AppFrame(props: AppFrameProps) {
	return <AppFrameView children={props.children} />
}