import "./AppFrame.scss";
import React from "react"
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawer";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawer";
import { Header } from "../Header/Header";
import { useAppFrameController } from "./useAppFrameController";
import { Sidebar } from "../../views/Sidebar/Sidebar";
import { useMdMedia } from "../../hooks/utils/useMedia";

export type AppFrameProps = {
	children: React.ReactNode;
}

export function AppFrame(props: AppFrameProps) {

	const controller = useAppFrameController(props)

	const isDesktopLayout = useMdMedia()

	return <div className="AppFrame">
		{
			controller.initialized && <>
				{isDesktopLayout ? null : <TransactionCreatorDrawer />}
				{isDesktopLayout ? null : <TransactionEditorDrawer />}
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