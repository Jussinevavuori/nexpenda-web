import "./AppFrame.scss";
import React from "react"
import { Sidebar } from "../../views/Sidebar/SidebarController";
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawerController";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawerController";
import { Header } from "../Header/HeaderController";
import { FiltersDrawer } from "../FiltersDrawer/FiltersDrawerController";

export type AppFrameViewProps = {
	children: React.ReactNode;
	initialized: boolean;
}

export function AppFrameView(props: AppFrameViewProps) {

	return <div className="AppFrame">
		{
			props.initialized && <>
				<TransactionCreatorDrawer />
				<TransactionEditorDrawer />
				<FiltersDrawer />
			</>
		}
		<div className="header">
			<Header />
		</div>
		<div className="sidebar">
			<Sidebar />
		</div>
		<div className="main">
			{props.children}
		</div>
	</div>
}