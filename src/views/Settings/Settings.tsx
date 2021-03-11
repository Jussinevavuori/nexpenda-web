import "./Settings.scss";
import React from "react"
import { Button, CircularProgress } from "@material-ui/core";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { FileUploader } from "../../components/FileUploader/FileUploader";
import { FileDownloader } from "../../components/FileDownloader/FileDownloader";
import { useSettingsController } from "./useSettingsController";
import { SettingsProfilePanel } from "./SettingsProfilePanel/SettingsProfilePanel";
import { SettingsSection } from "./SettingsSection/SettingsSection";
import { ThemePicker } from "../../components/ThemePicker/ThemePicker";
import { SettingsHeader } from "./SettingsHeader/SettingsHeader";
import { useMdMedia } from "../../hooks/utils/useMedia";

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

		<SettingsSection className="profilePanel" sectionTitle="Profile">
			<SettingsProfilePanel disableAvatar={!isDesktop} />
		</SettingsSection>

		<SettingsSection className="customization" sectionTitle="Customize">
			<ThemePicker />
		</SettingsSection>

		<SettingsSection className="fileHandlers" sectionTitle="Export and import data">
			<FileUploader />
			<FileDownloader />
		</SettingsSection>

		{
			process.env.NODE_ENV === "development" &&
			<SettingsSection sectionTitle="Subscribe">
				<Button
					variant="outlined"
					onClick={controller.handleSubscribe}
					fullWidth
				>
					{"Buy premium"}
				</Button>
			</SettingsSection>
		}


		<SettingsSection sectionTitle="Log out">
			<Button
				color="primary"
				variant="contained"
				onClick={controller.handleLogout}
				startIcon={<LogoutIcon />}
				fullWidth
			>
				{"Log out"}
			</Button>
		</SettingsSection>


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
	</div >
}