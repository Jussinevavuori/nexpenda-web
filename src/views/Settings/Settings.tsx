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

		<SettingsSection sectionTitle="Version">
			<Type>
				{"1.0.0"}
			</Type>
		</SettingsSection>

		<SettingsSection sectionTitle="Log out">
			<Type>
				<Button
					color="primary"
					variant="contained"
					onClick={controller.handleLogout}
					startIcon={<LogoutIcon />}
					fullWidth
				>
					{"Log out"}
				</Button>
			</Type>
		</SettingsSection>


	</div >
}