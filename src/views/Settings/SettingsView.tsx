import "./Settings.scss";
import React from "react"
import { Auth } from "../../classes/Auth";
import { Button, CircularProgress, Drawer } from "@material-ui/core";
import { useSmMedia } from "../../hooks/useMedia";
import { FileUploader } from "../../components/FileUploader/FileUploaderController";
import { ProcessQueueProgress } from "../../utils/ProcessQueue/ProcessQueue";
import { Type } from "../../components/Type/Type";

export type SettingsViewProps = {
	user: Auth;
	handleLogout(): void;
	uploaderOpen: boolean;
	onUploaderClose(): void;
	onUploaderOpen(): void;

	onDeleteAll(): void;
	deleteAllProgress?: ProcessQueueProgress<any>
}

export function SettingsView(props: SettingsViewProps) {

	const desktopLayout = useSmMedia()

	return <div className="Settings">

		<Drawer
			open={props.uploaderOpen}
			onClose={props.onUploaderClose}
			anchor={desktopLayout ? "left" : "bottom"}
		>
			<FileUploader />
		</Drawer>

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

		<div>
			{
				props.deleteAllProgress
					? <div>
						<CircularProgress
							variant="static"
							value={(props.deleteAllProgress.completed / Math.max(1, props.deleteAllProgress.total)) * 100}
						/>
						<Type>
							{`Alustetaan ${props.deleteAllProgress.completed}/${props.deleteAllProgress.total}`}
						</Type>
					</div>
					: <Button onClick={props.onDeleteAll}>
						{"Alusta"}
					</Button>
			}
		</div>

	</div>
}