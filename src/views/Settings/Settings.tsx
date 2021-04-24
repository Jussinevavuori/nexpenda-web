import "./Settings.scss";
import React from "react"
import { Button, CircularProgress } from "@material-ui/core";
import { Publish as UploadIcon, ExitToApp as LogoutIcon, Feedback as FeedbackIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { FileDownloader } from "../../components/FileDownloader/FileDownloader";
import { useSettingsController } from "./useSettingsController";
import { SettingsProfilePanel } from "./SettingsProfilePanel/SettingsProfilePanel";
import { ThemePicker } from "../../components/ThemePicker/ThemePicker";
import { SettingsHeader } from "./SettingsHeader/SettingsHeader";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { SettingsSubscriptionManager } from "../../components/SettingsPremiumSubscription/SettingsSubscriptionManager";
import { SubscribeBanner } from "../../components/SubscribeBanner/SubscribeBanner";
import { ContainerBlock } from "../../components/Container/ContainerBlock";

export type SettingsProps = {
}

export function Settings(props: SettingsProps) {

	const isDesktop = useMdMedia()
	const controller = useSettingsController()

	// Loading
	if (!controller.user) {
		return <div className="Settings loading">
			<CircularProgress />
			<Type>
				{"Loading profile"}
			</Type>
		</div>
	}

	return <div className="Settings">

		<SettingsHeader />

		<section>

			<ContainerBlock className="profilePanel" containerTitle="Profile">
				<SettingsProfilePanel disableAvatar={!isDesktop} />
			</ContainerBlock>

			{
				(process.env.NODE_ENV === "development" || controller.user.isAdmin) &&
				!controller.user.isPremium &&
				<ContainerBlock>
					<SubscribeBanner />
				</ContainerBlock>
			}


			<ContainerBlock className="customization" containerTitle="Customize">
				<ThemePicker />
			</ContainerBlock>

			<ContainerBlock className="fileHandlers" containerTitle="Import and export">
				<Type>
					{"Import existing transactions from your own spreadsheets "}
					{"or export all your transactions into a .xlsx spreadsheet."}
				</Type>
				<Button
					color="primary"
					variant="contained"
					endIcon={<UploadIcon />}
					onClick={controller.handleOpenFileUploaderDrawer}
					fullWidth
				>
					{"Import transactions"}
				</Button>
				<FileDownloader />
			</ContainerBlock>

			{
				controller.canManageBilling &&
				<ContainerBlock containerTitle="Manage your subscription">
					<SettingsSubscriptionManager />
				</ContainerBlock>
			}


			<ContainerBlock
				containerTitle="Send feedback"
				className="feedbackSection"
			>
				<Type color="gray-800" component="label">
					{"Send honest feedback, report bugs or tell us what you love "}
					{"about Nexpenda below!"}
				</Type>
				<Button
					variant="outlined"
					onClick={controller.handleOpenFeedbackDialog}
					startIcon={<FeedbackIcon />}
					fullWidth
				>
					{"Send feedback"}
				</Button>
			</ContainerBlock>


			<Button
				color="primary"
				variant="contained"
				onClick={controller.handleLogout}
				startIcon={<LogoutIcon />}
				fullWidth
			>
				{"Log out"}
			</Button>


			<div className="version">
				<Type component="span" size="sm" color="gray-600">
					{"Version"}
				</Type>
				<Type component="span" variant="bold" size="sm" color="gray-700" >
					{"0.1.1"}
				</Type>
				<Type component="span" variant="bold" size="sm" color="gray-600">
					{"Alpha"}
				</Type>
			</div>

		</section>
	</div >
}