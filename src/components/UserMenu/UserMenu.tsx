import "./UserMenu.scss";
import React, { forwardRef, Ref } from "react"
import cx from "classnames"
import { UserMenuRef, useUserMenuController } from "./useUserMenuController"
import { MenuItem, MenuList } from "@material-ui/core";
import { ExitToApp as LogoutIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { Type } from "../Type/Type";
import { ResponsiveMenu, ResponsiveMenuProps } from "../ResponsiveMenu/ResponsiveMenu";

export type UserMenuProps = {

} & Omit<ResponsiveMenuProps, "open" | "onClose">

export const UserMenu = forwardRef((props: UserMenuProps, ref: Ref<UserMenuRef>) => {

	const controller = useUserMenuController(props, ref)

	const { className, ...ResponsiveMenuProps } = props

	return <ResponsiveMenu
		className={cx("UserMenu", className)}
		open={controller.open}
		onClose={controller.handleClose}
		MenuProps={{
			anchorEl: controller.anchor.current,
			anchorOrigin: { horizontal: "right", vertical: "bottom" },
			transformOrigin: { horizontal: "right", vertical: "top" },
			getContentAnchorEl: null,
		}}
		{...ResponsiveMenuProps}
	>
		<div className="UserMenu__content" >
			<section className="profile">
				<Type variant="bold" size="lg" component="h2">
					{controller.user?.displayName ?? "Not logged in"}
				</Type>
				<Type color="gray-700">
					{controller.user?.email ?? "No email"}
				</Type>
			</section>
			<section className="actions">
				<MenuList>
					<MenuItem onClick={controller.handleSettings}>
						<SettingsIcon />
						<Type variant="bold">
							{"Settings"}
						</Type>
					</MenuItem>
					<MenuItem onClick={controller.handleLogout}>
						<LogoutIcon />
						<Type variant="bold">
							{"Log out"}
						</Type>
					</MenuItem>
				</MenuList>
			</section>
		</div>
	</ResponsiveMenu>
})