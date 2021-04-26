import "./ProfilePanel.scss";
import React from "react"
import cx from "classnames"
import { useProfilePanelController } from "./useProfilePanelController"
import { Button, CircularProgress, IconButton, TextField } from "@material-ui/core";
import { Type } from "../Type/Type";
import { Clear as ClearIcon, Check as CheckIcon, Edit as EditIcon } from "@material-ui/icons";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { Link } from "react-router-dom";
import { routes } from "../../Routes";

export type ProfilePanelProps = {
	disableAvatar?: boolean;
}

export function ProfilePanel(props: ProfilePanelProps) {

	const controller = useProfilePanelController(props)

	if (!controller.user) return null

	return <div className={cx("ProfilePanel", {
		avatarDisabled: props.disableAvatar
	})}>

		{
			!props.disableAvatar &&
			<div className="avatarContainer">
				<UserAvatar />
			</div>
		}

		<div className="container nameContainer" onClick={controller.name.handleStartEdit}>
			{
				controller.name.editing
					? <div className="editNameContainer">
						<TextField
							id={controller.editNameInputId}
							label="Name"
							value={controller.name.value}
							onChange={e => controller.name.setValue(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Escape") {
									controller.name.handleCancelEdit()
								} else if (e.key === "Enter") {
									controller.name.handleSubmit()
								}
							}}
							variant="outlined"
							size="small"
						/>
						<IconButton
							disabled={controller.name.loading}
							onClick={e => {
								e.stopPropagation()
								controller.name.handleSubmit()
							}}
						>
							{
								controller.name.loading
									? <CircularProgress size={24} />
									: <CheckIcon className="check" />
							}
						</IconButton>
						<IconButton
							disabled={controller.name.loading}
							onClick={e => {
								e.stopPropagation();
								controller.name.handleCancelEdit();
							}}
						>
							<ClearIcon className="clear" />
						</IconButton>
					</div>
					: <div className="editableContainer">
						<div>
							<Type component="label" size="sm" variant="boldcaps" color="gray-700">
								{"Name"}
							</Type>
							<Type>
								{controller.user.displayName}
							</Type>
						</div>
						<IconButton onClick={(e) => {
							e.stopPropagation()
							controller.name.handleStartEdit()
						}}>
							<EditIcon />
						</IconButton>
					</div>
			}
		</div>

		<div className="container emailContainer">
			<Type component="label" size="sm" variant="boldcaps" color="gray-700">
				{"Email"}
			</Type>
			<Type>
				{controller.user.email}
			</Type>
		</div>

		<div className="container accountTypeContainer">
			<Type component="label" size="sm" variant="boldcaps" color="gray-700">
				{"Account type"}
			</Type>
			{
				controller.user.isPremium
					? <div className="account">

						<Type >
							{"Premium"}
						</Type>

						<Button size="small" variant="text" onClick={controller.handleManageSubscription}>
							{"Manage"}
						</Button>

					</div>
					: <div className="account">
						<Type>
							{"Free"}
						</Type>

						<Link to={routes.subscribe.path}>
							<Button size="small" variant="text" >
								{"Upgrade"}
							</Button>
						</Link>
					</div>
			}
		</div>

	</div>
}