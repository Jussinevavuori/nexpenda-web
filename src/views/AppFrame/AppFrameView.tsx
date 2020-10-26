import "./AppFrame.scss";
import React from "react"
import { Sidebar } from "../Sidebar/SidebarController";
import { TransactionEditorDrawer } from "../../components/TransactionEditorDrawer/TransactionEditorDrawerController";
import { TransactionCreatorDrawer } from "../../components/TransactionCreatorDrawer/TransactionCreatorDrawerController";

export type AppFrameViewProps = {
	children: React.ReactNode;
}

export function AppFrameView(props: AppFrameViewProps) {
	return <div className="AppFrame">
		<TransactionCreatorDrawer />
		<TransactionEditorDrawer />
		<div className="sidebar">
			<Sidebar />
		</div>
		<div className="main">
			{props.children}
		</div>
	</div>
}