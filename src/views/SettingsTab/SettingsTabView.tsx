import styles from "./SettingsTabView.module.css";
import React from "react"
import { Auth } from "../../models/authentication/auth.class";

export type SettingsTabViewProps = {
	user: Auth;
	handleLogout(): void;
}

export function SettingsTabView(props: SettingsTabViewProps) {

	return <div className={styles.root}>

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

		<button onClick={props.handleLogout}>Log out</button>

	</div>
}