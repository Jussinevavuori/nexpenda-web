import "./BudgetBlockMenu.scss";
import React from "react";
import cx from "classnames";
import { useBudgetBlockMenuController } from "./useBudgetBlockMenuController";
import { ResponsiveMenu, ResponsiveMenuProps } from "../ResponsiveMenu/ResponsiveMenu";
import { Budget } from "../../classes/Budget";
import { MenuItem } from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import { Type } from "../Type/Type";

export type BudgetBlockMenuProps = {
	budget: Budget;
} & ResponsiveMenuProps

export function BudgetBlockMenu(props: BudgetBlockMenuProps) {
	const controller = useBudgetBlockMenuController(props)

	const { budget, ...responsiveMenuProps } = props

	return <ResponsiveMenu {...responsiveMenuProps}>
		<div className={cx("BudgetBlockMenu")}>
			{
				process.env.NODE_ENV === "development" &&
				<MenuItem
					className="edit"
					onClick={controller.handleEdit}
				>
					<Type variant="bold" color="primary-600">
						<EditIcon />
						{"Edit"}
					</Type>
				</MenuItem>
			}
			<MenuItem
				className="delete"
				onClick={controller.handleDelete}
			>
				<Type variant="bold" color="red-600">
					<DeleteIcon />
					{"Delete"}
				</Type>
			</MenuItem>
		</div>
	</ResponsiveMenu>
}