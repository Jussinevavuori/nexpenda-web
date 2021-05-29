import "./UserAvatar.scss";
import React from "react"
import cx from "classnames"
import { useUserAvatarController } from "./useUserAvatarController"
import { Avatar, AvatarProps, CircularProgress } from "@material-ui/core";

export type UserAvatarProps = {
	hoverIcon?: JSX.Element;
} & Omit<AvatarProps, "children">

export function UserAvatar(props: UserAvatarProps) {

	const { className, hoverIcon, ...MuiAvatarProps } = props

	const controller = useUserAvatarController(props)

	const isClickable = !!props.onClick

	return <Avatar
		className={cx("UserAvatar", className, { isClickable })}
		{...MuiAvatarProps}
	>
		{
			isClickable && props.hoverIcon &&
			<div className="hover">
				{props.hoverIcon}
			</div>
		}
		{
			controller.user
				? controller.user.photoUrl
					? <img alt="profileimage" src={controller.user.photoUrl} />
					: <span className="initials">{controller.user.initials}</span>
				: <CircularProgress variant="indeterminate" />
		}
	</Avatar>
}