import "./Settings.scss";
import React from "react"
import { Button, CircularProgress } from "@material-ui/core";
import { Publish as UploadIcon, ExitToApp as LogoutIcon, Feedback as FeedbackIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { FileDownloader } from "../../components/FileDownloader/FileDownloader";
import { useSettingsController } from "./useSettingsController";
import { ThemePicker } from "../../components/ThemePicker/ThemePicker";
import { useMdMedia } from "../../hooks/utils/useMedia";
import { SettingsSubscriptionManager } from "../../components/SettingsPremiumSubscription/SettingsSubscriptionManager";
import { SubscribeBanner } from "../../components/SubscribeBanner/SubscribeBanner";
import { ContainerBlock } from "../../components/Container/ContainerBlock";
import { ViewContainer } from "../../components/ViewContainer/ViewContainer";
import { ViewHeader } from "../../components/ViewHeader/ViewHeader";
import { UserAvatar } from "../../components/UserAvatar/UserAvatar";
import { ProfilePanel } from "../../components/ProfilePanel/ProfilePanel";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import { Config } from "../../config";

export type SettingsProps = {
}

export function Settings(props: SettingsProps) {

	const isDesktop = useMdMedia()
	const controller = useSettingsController()
	const isDarkTheme = useIsDarkTheme()

	// Loading
	if (!controller.user) {
		return <div className="Settings loading">
			<CircularProgress />
			<Type>
				{"Loading profile"}
			</Type>
		</div>
	}

	return <ViewContainer
		scrollable
		viewHeader={<ViewHeader>
			<div className="Settings__headerContent">
				<UserAvatar />
			</div>
		</ViewHeader>}
	>

		<div className="Settings">

			<Type
				component="h2"
				variant="bold"
				size="xl"
				color={isDarkTheme ? "gray-100" : "gray-900"}
			>
				{`Settings`}
			</Type>

			<ContainerBlock className="profilePanel" containerTitle="Profile">
				<ProfilePanel disableAvatar={!isDesktop} />
			</ContainerBlock>

			{
				!controller.user.isPremium &&
				<SubscribeBanner />
			}


			<ContainerBlock className="customization" containerTitle="Theme">
				<ThemePicker />
			</ContainerBlock>

			<ContainerBlock className="fileHandlers" containerTitle="Import and export">
				<Type
					color={isDarkTheme ? "gray-400" : "gray-800"}
				>
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
				<Type
					color={isDarkTheme ? "gray-400" : "gray-800"}
					component="label"
				>
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
					{Config.VERSION}
				</Type>
				<Type component="span" variant="bold" size="sm" color="gray-600">
					{"Alpha"}
				</Type>
			</div>

		</div >
	</ViewContainer>
}