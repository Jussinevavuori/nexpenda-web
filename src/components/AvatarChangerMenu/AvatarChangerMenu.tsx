import "./AvatarChangerMenu.scss";
import React from "react";
import cx from "classnames";
import { useAvatarChangerMenuController } from "./useAvatarChangerMenuController";
import { MenuItem } from "@material-ui/core";
import { Image, Delete, Flare } from "@material-ui/icons";
import { Type } from "../Type/Type";
import { ResponsiveMenu, ResponsiveMenuProps } from "../ResponsiveMenu/ResponsiveMenu";

export type AvatarChangerMenuProps = {

} & Omit<ResponsiveMenuProps, "children">;

export function AvatarChangerMenu(props: AvatarChangerMenuProps) {
	const controller = useAvatarChangerMenuController(props)

	return <ResponsiveMenu
		{...props}
		className={cx("AvatarChangerMenu", props.className)}
	>

		{/* Upload new avatar */}
		<MenuItem onClick={controller.handleSelectUpload} className="upload">
			<Type variant="bold">
				<Image />
				{"Upload new avatar"}
			</Type>
		</MenuItem>

		{/* Reset avatar to google photo URL */}
		{
			controller.canReset &&
			<MenuItem
				onClick={controller.handleSelectReset}
				className="reset"
				disabled={controller.disableReset}
			>
				<Type variant="bold">
					<Flare />
					{"Reset avatar"}
				</Type>
			</MenuItem>
		}

		{/* Remove avatar */}
		<MenuItem
			onClick={controller.handleSelectRemove}
			className="remove"
			disabled={controller.disableRemove}
		>
			<Type variant="bold">
				<Delete />
				{"Remove current avatar"}
			</Type>
		</MenuItem>
	</ResponsiveMenu>
}