import "./ProfileManager.scss";
import React from "react"
import { Avatar } from "@material-ui/core";

export type ProfileManagerViewProps = {

}

export function ProfileManagerView(props: ProfileManagerViewProps) {
	return <div className="ProfileManager">
		<Avatar>
			{"JN"}
		</Avatar>
	</div>
}