import React from "react"
import { useStoreState } from "../../store"
import { AppFrameView } from "./AppFrameView"

export type AppFrameProps = {
	children: React.ReactNode;
}

export function AppFrame(props: AppFrameProps) {

	const initialized = useStoreState(_ => _.auth.initialized)

	return <AppFrameView
		children={props.children}
		initialized={initialized}
	/>
}