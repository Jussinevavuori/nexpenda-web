import "./Header.scss";
import React from "react"
import { IntervalManager } from "../IntervalManager/IntervalManagerController";
import { ProfileManager } from "../ProfileManager/ProfileManagerController";

export type HeaderProps = {

}

export function Header(props: HeaderProps) {
	return <div className="Header">

		<div className="intervalManager">
			<IntervalManager />
		</div>

		<div className="profileManager">
			<ProfileManager />
		</div>

	</div>
}