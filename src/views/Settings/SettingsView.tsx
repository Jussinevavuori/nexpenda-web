import "./Settings.scss";
import React from "react"
import { Auth } from "../../classes/Auth";
import { Button } from "@material-ui/core";
import { FileUploader } from "../../components/FileUploader/FileUploaderController";
import { ResponsiveDrawer } from "../../components/ResponsiveDrawer/ResponsiveDrawerController";

export type SettingsViewProps = {
	user: Auth;
	handleLogout(): void;

	uploaderOpen: boolean;
	onUploaderClose(): void;
	onUploaderOpen(): void;
}

export function SettingsView(props: SettingsViewProps) {

	return <div className="Settings">

		<ResponsiveDrawer
			open={props.uploaderOpen}
			onClose={props.onUploaderClose}
		>
			<FileUploader />
		</ResponsiveDrawer>

		{
			props.user.photoUrl ? <img style={{ width: 64, height: 64 }} alt="profile" src={props.user.photoUrl} /> : null
		}

		<table>
			<tbody>
				<tr>
					<td>Display name</td>
					<td>{props.user.displayName}</td>
				</tr>
				<tr>
					<td>Email</td>
					<td>{props.user.email}</td>
				</tr>
				<tr>
					<td>ID</td>
					<td>{props.user.id}</td>
				</tr>
				<tr>
					<td>Google ID</td>
					<td>{props.user.googleId}</td>
				</tr>
			</tbody>
		</table>

		<div>
			<button onClick={props.handleLogout}>Log out</button>
		</div>

		<div>
			<Button onClick={props.onUploaderOpen}>
				{"Tuo tiedostosta"}
			</Button>
		</div>

	</div>
}