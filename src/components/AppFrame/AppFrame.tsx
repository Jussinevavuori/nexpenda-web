import "./AppFrame.scss";
import React from "react"
import { TransactionEditorDrawer } from "../TransactionEditorDrawer/TransactionEditorDrawer";
import { TransactionCreatorDrawer } from "../TransactionCreatorDrawer/TransactionCreatorDrawer";
import { Header } from "../Header/Header";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { BudgetEditorDialog } from "../BudgetEditorDialog/BudgetEditorDialog";
import { BudgetCreatorDialog } from "../BudgetCreatorDialog/BudgetCreatorDialog";
import { FeedbackDialog } from "../FeedbackDialog/FeedbackDialog";
import { FileUploaderDrawer } from "../FileUploaderDrawer/FileUploaderDrawer";
import { AnimateSharedLayout } from "framer-motion";
import { SidebarNavigation } from "../SidebarNavigation/SidebarNavigation";
import { TabNavigation } from "../TabNavigation/TabNavigation";
import { FreemiumTrackerDialog } from "../FreemiumTrackerDialog/FreemiumTrackerDialog";
import { AvatarChangerDialog } from "../AvatarChangerDialog/AvatarChangerDialog";
import { SchedulesManagerDrawer } from "../SchedulesManagerDrawer/SchedulesManagerDrawer";
import { ScheduleEditorDialog } from "../ScheduleEditorDialog/ScheduleEditorDialog";
import { ScheduleCreatorDialog } from "../ScheduleCreatorDialog/ScheduleCreatorDialog";

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
			<FreemiumTrackerDialog />
			<AvatarChangerDialog />
			<SchedulesManagerDrawer />
			<ScheduleEditorDialog />
			<ScheduleCreatorDialog />

			{/* Static elements */}
			<header>
				<Header />
			</header>
			<main >
				{props.children}
			</main>
			<nav>
				{
					isDesktopLayout ? <SidebarNavigation /> : <TabNavigation />
				}
			</nav>
		</div>
	</AnimateSharedLayout>
}