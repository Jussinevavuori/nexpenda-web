import "./AppFrame.scss";
import React from "react"
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawer";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawer";
import { Header } from "../Header/Header";
import { Sidebar } from "../../views/Sidebar/Sidebar";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { BudgetEditorDialog } from "../BudgetEditorDialog/BudgetEditorDialog";
import { BudgetCreatorDialog } from "../BudgetCreatorDialog/BudgetCreatorDialog";
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

			{/* Rendered inline on desktop layout */}
			{!isDesktopLayout && <TransactionCreatorDrawer />}
			{!isDesktopLayout && <TransactionEditorDrawer />}

			{/* Always rendered in dialog / drawer */}
			<BudgetEditorDialog />
			<BudgetCreatorDialog />
			<FeedbackDialog />
			<FileUploaderDrawer />

			{/* Static elements */}
			<div className="header">
				<Header />
			</div>
			<div className="main">
				{props.children}
			</div>
			<div className="sidebar">
				<Sidebar />
			</div>
		</div>
	</AnimateSharedLayout>
}