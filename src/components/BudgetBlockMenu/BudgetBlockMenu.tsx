import "./BudgetBlockMenu.scss";
import React from "react";
import cx from "classnames";
import { useBudgetBlockMenuController } from "./useBudgetBlockMenuController";
import { ResponsiveMenu, ResponsiveMenuProps } from "../ResponsiveMenu/ResponsiveMenu";
import { Budget } from "../../lib/DataModels/Budget";
import { MenuItem } from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import { Type } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type BudgetBlockMenuProps = {
	budget: Budget;
} & Omit<ResponsiveMenuProps, "open" | "onClose">

export function BudgetBlockMenu(props: BudgetBlockMenuProps) {
	const controller = useBudgetBlockMenuController(props)
	const { budget, ...responsiveMenuProps } = props
	const isDarkTheme = useIsDarkTheme()

	return <ResponsiveMenu
		{...responsiveMenuProps}
		open={controller.isOpen}
		onClose={controller.handleClose}
	>
		<div className={cx("BudgetBlockMenu")}>
			<MenuItem className="edit" onClick={controller.handleEdit} >
				<Type variant="bold" color={isDarkTheme ? "primary-400" : "primary-600"}>
					<EditIcon />
					{"Edit"}
				</Type>
			</MenuItem>
			<MenuItem className="delete" onClick={controller.handleDelete} >
				<Type variant="bold" color={isDarkTheme ? "red-400" : "red-600"}>
					<DeleteIcon />
					{"Delete"}
				</Type>
			</MenuItem>
		</div>
	</ResponsiveMenu>
}