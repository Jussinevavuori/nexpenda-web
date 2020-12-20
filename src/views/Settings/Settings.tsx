import "./Settings.scss";
import React from "react"
import { Button, CircularProgress } from "@material-ui/core";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { FileUploader } from "../../components/FileUploader/FileUploaderController";
import { FileDownloader } from "../../components/FileDownloader/FileDownloaderController";
import { useSettingsController } from "./useSettingsController";
import { SettingsProfilePanel } from "./SettingsProfilePanel/SettingsProfilePanel";

export type SettingsProps = {
}

export function Settings(props: SettingsProps) {

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

		<div className="profilePanel">
			<SettingsProfilePanel />
		</div>

		<div className="fileHandlers">
			<FileUploader />
			<FileDownloader />
		</div>

		<Button
			color="primary"
			variant="contained"
			onClick={controller.handleLogout}
			startIcon={<LogoutIcon />}
			fullWidth
		>
			{"Log out"}
		</Button>

	</div>
}