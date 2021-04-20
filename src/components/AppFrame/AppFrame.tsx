import "./AppFrame.scss";
import React from "react"
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawer";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawer";
import { Header } from "../Header/Header";
import { Sidebar } from "../../views/Sidebar/Sidebar";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { BudgetEditorDrawer } from "../BudgetEditorDrawer/BudgetEditorDrawer";
import { BudgetCreatorDrawer } from "../BudgetCreatorDrawer/BudgetCreatorDrawer";
import { FeedbackDialog } from "../FeedbackDialog/FeedbackDialog";
import { FileUploaderDrawer } from "../FileUploaderDrawer/FileUploaderDrawer";
import { AnimateSharedLayout } from "framer-motion";

export type AppFrameProps = {
	children: React.ReactNode;
}

export function AppFrame(props: AppFrameProps) {


	const isDesktopLayout = useMdMedia()

	return <AnimateSharedLayout>
		<div className="AppFrame">
			{isDesktopLayout ? null : <TransactionCreatorDrawer />}
			{isDesktopLayout ? null : <TransactionEditorDrawer />}
			<BudgetEditorDrawer />
			<BudgetCreatorDrawer />
			<FeedbackDialog />
			<FileUploaderDrawer />
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
	</AnimateSharedLayout>
}