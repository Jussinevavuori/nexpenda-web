import "./UserAvatar.scss";
import React from "react"
import cx from "classnames"
import { useUserAvatarController } from "./useUserAvatarController"
import { Avatar, AvatarProps, CircularProgress } from "@material-ui/core";

export type UserAvatarProps = {

} & AvatarProps

export function UserAvatar(props: UserAvatarProps) {

	const { className, ...MuiAvatarProps } = props

	const controller = useUserAvatarController(props)

	return <Avatar
		className={cx("UserAvatar", className)}
		{...MuiAvatarProps}
	>
		{
			controller.user
				? controller.user.photoUrl
					? <img alt="profileimage" src={controller.user.photoUrl} />
					: controller.user.initials
				: <CircularProgress variant="indeterminate" />
		}
	</Avatar>
}