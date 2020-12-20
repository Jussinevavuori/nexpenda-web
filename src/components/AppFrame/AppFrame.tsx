import "./AppFrame.scss";
import React from "react"
import { Sidebar } from "../../views/Sidebar/SidebarController";
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawerController";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawerController";
import { Header } from "../Header/Header";
import { FiltersDrawer } from "../FiltersDrawer/FiltersDrawerController";
import { useAppFrameController } from "./useAppFrameController";

export type AppFrameProps = {
	children: React.ReactNode;
}

export function AppFrame(props: AppFrameProps) {

	const controller = useAppFrameController(props)

	return <div className="AppFrame">
		{
			controller.initialized && <>
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