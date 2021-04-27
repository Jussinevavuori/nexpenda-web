import "./Logout.scss";
import React from "react";
import cx from "classnames";
import { useLogoutController } from "./useLogoutController";
import { Type } from "../../components/Type/Type";

export type LogoutProps = {

};

export function Logout(props: LogoutProps) {
	const controller = useLogoutController(props)

	return <div className={cx("Logout")}>
		<Type>
			{"You have been logged out. You should be redirected momentarily."}
		</Type>
		<Type>
			{"If you have not been redirected,"}
			<span className="anchor" onClick={controller.handleRedirect}>
				{"click here"}
			</span>
			{"to return to the login page."}
		</Type>
	</div>
}