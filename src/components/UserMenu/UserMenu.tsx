import "./UserMenu.scss";
import React from "react"
import cx from "classnames"
import { useUserMenuController } from "./useUserMenuController"
import { MenuItem, MenuList } from "@material-ui/core";
import { ExitToApp as LogoutIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { Type } from "../Type/Type";
import { ResponsiveMenu, ResponsiveMenuProps } from "../ResponsiveMenu/ResponsiveMenu";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import { Link } from "react-router-dom";
import { routes } from "../../Routes";

export type UserMenuProps = {

} & Omit<ResponsiveMenuProps, "open" | "onClose">

export function UserMenu(props: UserMenuProps) {

	const controller = useUserMenuController(props)
	const { className, ...ResponsiveMenuProps } = props
	const isDarkTheme = useIsDarkTheme()

	return <ResponsiveMenu
		className={cx("UserMenu", className)}
		open={controller.isOpen}
		onClose={controller.handleClose}
		MenuProps={{
			anchorEl: controller.anchorEl,
			anchorOrigin: { horizontal: "right", vertical: "bottom" },
			transformOrigin: { horizontal: "right", vertical: "top" },
			getContentAnchorEl: null,
		}}
		{...ResponsiveMenuProps}
	>
		<div className="UserMenu__content" >
			<section className="profile">
				<Type variant="bold">
					{controller.user?.displayName ?? "Not logged in"}
				</Type>
				<Type color={isDarkTheme ? "gray-400" : "gray-700"}>
					{controller.user?.email ?? "No email"}
				</Type>
			</section>
			<section className="actions">
				<MenuList>
					<Link to={routes.settings.path} replace>
						<MenuItem>
							<SettingsIcon />
							<Type >
								{"Settings"}
							</Type>
						</MenuItem>
					</Link>
					<MenuItem onClick={controller.handleLogout}>
						<LogoutIcon />
						<Type >
							{"Log out"}
						</Type>
					</MenuItem>
				</MenuList>
			</section>
		</div>
	</ResponsiveMenu>
}