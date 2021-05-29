import "./UserManager.scss";
import React from "react"
import { useUserManagerController } from "./useUserManagerController";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { UserMenu } from "../UserMenu/UserMenu";

export type UserManagerProps = {

}

export function UserManager(props: UserManagerProps) {

	const controller = useUserManagerController(props)

	return <div className="UserManager">
		<UserAvatar
			tabIndex={0}
			onClick={controller.userMenu.handleOpen}
		/>
		<UserMenu />
	</div>
}