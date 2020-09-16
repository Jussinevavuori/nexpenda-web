import "./Settings.scss";
import React from "react"
import { Auth } from "../../classes/Auth";
import { readFileAsJsonTransactions } from "../../utils/xlsx/xlsx";

export type SettingsViewProps = {
	user: Auth;
	handleLogout(): void;
}

export function SettingsView(props: SettingsViewProps) {

	function fileUploadHandler(e: React.ChangeEvent<HTMLInputElement>) {
		readFileAsJsonTransactions(e.target).then(result => {
			result
				.onSuccess((value) => {
					console.log("Success:", value)
				})
				.onFailure((value) => {
					console.log("Failure:", value)
				})
		})
	}


	return <div className="Settings">

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
			<label>Import data from Excel</label>
			<input type="file" onChange={fileUploadHandler} />
		</div>

		<div>
			<button>Export data</button>
		</div>

	</div>
}