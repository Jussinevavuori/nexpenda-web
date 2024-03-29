import "./Settings.scss";
import React from "react"
import { Button, CircularProgress } from "@material-ui/core";
import { Publish as UploadIcon, ExitToApp as LogoutIcon, Feedback as FeedbackIcon, Camera, Replay, Palette, AccountBalance, RateReview, Person } from "@material-ui/icons";
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
import { FreemiumTracker } from "../../components/FreemiumTracker/FreemiumTracker";
import { AvatarChangerMenu } from "../../components/AvatarChangerMenu/AvatarChangerMenu";
import { routes } from "../../Routes";
import { Link } from "react-router-dom";

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

	return <>
		<AvatarChangerMenu
			open={controller.avatarChangerMenu.isOpen}
			onClose={controller.avatarChangerMenu.handleClose}
			DrawerProps={{ anchor: "bottom" }}
			MenuProps={{ anchorEl: controller.avatarChangerMenu.anchorEl }}
		/>

		<ViewContainer
			scrollable
			viewHeader={<ViewHeader>
				<div className="Settings__headerContent">
					<UserAvatar
						hoverIcon={<Camera />}
						onClick={controller.avatarChangerMenu.handleOpen}
					/>
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
					<Person className="sectionIcon" />
					<ProfilePanel
						disableAvatar={!isDesktop}
						UserAvatarProps={{
							hoverIcon: <Camera />,
							onClick: controller.avatarChangerMenu.handleOpen,
						}}
					/>
				</ContainerBlock>

				{
					!controller.user.isPremium &&
					<SubscribeBanner />
				}

				{
					!isDesktop && !controller.user.isPremium &&
					<ContainerBlock containerTitle="Free limits">
						<FreemiumTracker />
					</ContainerBlock>
				}

				<ContainerBlock containerTitle="Theme">
					<Palette className="sectionIcon" />
					<ThemePicker />
				</ContainerBlock>

				
					<ContainerBlock className="schedules" containerTitle="Scheduled transactions" >
						<Replay className="sectionIcon" />
						<Type
							color={isDarkTheme ? "gray-400" : "gray-800"}
						>
							{"All your scheduled transactions can be viewed, edited "}
							{"or canceled from here."}
						</Type>
						<Link to={routes.schedules.path}>
							<Button color="primary" variant="contained" fullWidth>
								{"View all"}
							</Button>
						</Link>
					</ContainerBlock>
				

				<ContainerBlock className="fileHandlers" containerTitle="Import and export">
					<UploadIcon className="sectionIcon" />
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
						onClick={() => controller.handleOpenFileUploader()}
						fullWidth
					>
						{"Import transactions"}
					</Button>
					<FileDownloader />
				</ContainerBlock>

				{
					controller.canManageBilling &&
					<ContainerBlock containerTitle="Subscription">
						<AccountBalance className="sectionIcon" />
						<SettingsSubscriptionManager />
					</ContainerBlock>
				}

				<ContainerBlock
					containerTitle="Send feedback"
					className="feedbackSection"
				>
					<RateReview className="sectionIcon" />
					<Type
						color={isDarkTheme ? "gray-400" : "gray-800"}
						component="label"
					>
						{"Send honest feedback, report bugs or tell us what you love "}
						{"about Nexpenda below!"}
					</Type>
					<Button
						variant="outlined"
						onClick={() => controller.handleOpenFeedback()}
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
				</div>

			</div >
		</ViewContainer>
	</>
}
