import "./AppFrame.scss";
import React from "react"
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawer";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawer";
import { Header } from "../Header/Header";
import { FiltersDrawer } from "../FiltersDrawer/FiltersDrawer";
import { useAppFrameController } from "./useAppFrameController";
import { Sidebar } from "../../views/Sidebar/Sidebar";

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