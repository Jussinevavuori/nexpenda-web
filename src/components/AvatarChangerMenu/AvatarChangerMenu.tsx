import "./AvatarChangerMenu.scss";
import React from "react";
import cx from "classnames";
import { useAvatarChangerMenuController } from "./useAvatarChangerMenuController";
import { MenuItem } from "@material-ui/core";
import { Camera, Delete } from "@material-ui/icons";
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
		<MenuItem onClick={controller.handleSelectUpload} className="upload">
			<Type variant="bold">
				<Camera />
				{"Upload new avatar"}
			</Type>
		</MenuItem>
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