import "./Settings.scss";
import React from "react"
import { Auth } from "../../classes/Auth";
import { Avatar, Button } from "@material-ui/core";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { Type } from "../../components/Type/Type";
import { FileUploader } from "../../components/FileUploader/FileUploaderController";

export type SettingsViewProps = {
	user: Auth;
	handleLogout(): void;
}

export function SettingsView(props: SettingsViewProps) {

	return <div className="Settings">

		<PageHeader>

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

		</PageHeader>

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