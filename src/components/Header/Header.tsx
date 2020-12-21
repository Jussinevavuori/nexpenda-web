import "./Header.scss";
import React from "react"
import { IntervalManager } from "../IntervalManager/IntervalManager";
import { UserManager } from "../UserManager/UserManager";

export type HeaderProps = {

}

export function Header(props: HeaderProps) {
	return <div className="Header">

		<div className="intervalManager">
			<IntervalManager />
		</div>

		<div className="profileManager">
			<UserManager />
		</div>

	</div>
}