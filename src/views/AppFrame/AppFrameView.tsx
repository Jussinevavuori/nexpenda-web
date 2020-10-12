import "./AppFrame.scss";
import React from "react"
import { Sidebar } from "../Sidebar/SidebarController";

export type AppFrameViewProps = {
	children: React.ReactNode;
}

export function AppFrameView(props: AppFrameViewProps) {
	return <div className="AppFrame">
		<div className="sidebar">
			<Sidebar />
		</div>
		<div className="main">
			{props.children}
		</div>
	</div>
}