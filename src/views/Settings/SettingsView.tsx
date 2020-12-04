import "./Settings.scss";
import React from "react"
import { Auth } from "../../classes/Auth";
import { Avatar, Button, CircularProgress } from "@material-ui/core";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { FileUploader } from "../../components/FileUploader/FileUploaderController";
import { FileDownloader } from "../../components/FileDownloader/FileDownloaderController";

export type SettingsViewProps = {
	user: Auth | null;
	handleLogout(): void;
}

export function SettingsView(props: SettingsViewProps) {

	if (!props.user) {
		return <div className="Settings">
			<div className="settingsSkeleton">

				<CircularProgress />

				<Type>
					{"Loading profile"}
				</Type>

			</div>

		</div>
	}

	return <div className="Settings">

		<div className="pageHeaderContent">

			<div className="pageHeaderAvatarContainer">
				<Avatar>
					{
						props.user.photoUrl
							? <img alt="profileimage" src={props.user.photoUrl} />
							: props.user.initials
					}
				</Avatar>
			</div>

		</div>

		<div className="content">

			<div className="profileDetails">

				<div className="row">
					<Type>
						{"Name"}
					</Type>
					<Type>
						{props.user.displayName}
					</Type>
				</div>

				<div className="row">
					<Type>
						{"Email"}
					</Type>
					<Type>
						{props.user.email}
					</Type>
				</div>
			</div>

			<div className="uploader">
				<FileUploader />
			</div>

			<div className="downloader">
				<FileDownloader />
			</div>

			<div className="logOutContainer">
				<Button
					color="primary"
					variant="contained"
					onClick={props.handleLogout}
					startIcon={<LogoutIcon />}
				>
					{"Log out"}
				</Button>
			</div>

		</div>

	</div>
}