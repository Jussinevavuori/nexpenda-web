import "./TransactionContextMenu.scss";
import React from "react"
import { Divider, Menu, MenuItem } from "@material-ui/core";
import {
	SelectAll as SelectAllIcon,
	Clear as DeselectAllIcon,
	CheckBoxOutlineBlank as SelectIcon,
	CheckBox as DeselectIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Search as SearchIcon,
} from "@material-ui/icons";
import { useTransactionContextMenuController } from "./useTransactionContextMenuController";
import { Type } from "../Type/Type";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";


export type TransactionContextMenuProps = {
}

export function TransactionContextMenu(props: TransactionContextMenuProps) {

	const controller = useTransactionContextMenuController(props)
	const isDarkTheme = useIsDarkTheme()

	return <Menu
		className="TransactionContextMenu"
		open={!!controller.position && !!controller.transaction}
		anchorReference="anchorPosition"
		anchorPosition={controller.position}
		onClose={controller.onClose}
	>

		{/* Edit */}
		<MenuItem
			onClick={controller.onEdit}
			className="editItem"
		>
			<EditIcon />
			<Type
				disablePointerEvents
				component="label"
				variant="bold"
				color={isDarkTheme ? "primary-400" : "primary-600"}
			>
				{"Edit"}
			</Type>
			<Type
				disablePointerEvents
				className="shortcut"
				component="span"
				color="gray-500"
			>
				{"Shift + E"}
			</Type>
		</MenuItem>

		{/* Delete */}
		<MenuItem
			onClick={controller.onDelete}
			className="deleteItem"
		>
			<DeleteIcon />
			<Type
				disablePointerEvents
				component="label"
				variant="bold"
				color={isDarkTheme ? "red-400" : "red-600"}
			>
				{"Delete"}
			</Type>
			<Type
				disablePointerEvents
				className="shortcut"
				component="span"
				color="gray-500"
			>
				{"Shift + D"}
			</Type>
		</MenuItem>

		<Divider />

		{/* Select */}
		<MenuItem
			onClick={controller.onSelectToggle}
			className="selectItem"
		>
			{controller.isSelected ? <DeselectIcon /> : <SelectIcon />}
			<Type disablePointerEvents component="label" variant="bold">
				{controller.isSelected ? "Deselect" : "Select"}
			</Type>
		</MenuItem>

		{/* Select all */}
		<MenuItem
			onClick={controller.onSelectAllToggle}
			className="selectAllItem"
		>
			{controller.isAllSelected ? <DeselectAllIcon /> : <SelectAllIcon />}

			<Type disablePointerEvents component="label" variant="bold">
				{controller.isAllSelected ? "Deselect all" : "Select all"}
			</Type>
			<Type disablePointerEvents className="shortcut" component="span" color="gray-500">
				{controller.isAllSelected ? "Shift + Alt + A" : "Shift + A"}
			</Type>
		</MenuItem>

		<Divider />

		{/* Toggle category filter */}
		<MenuItem
			onClick={controller.onToggleCategoryFilter}
			className="toggleCategoryFilter"
		>
			<SearchIcon />
			<Type disablePointerEvents component="label" variant="bold">
				{
					controller.isCategoryFilterToggledOn
						? `Cancel filter by category ${controller.latestTransaction?.category.name}`
						: `Filter by category ${controller.latestTransaction?.category.name}`
				}
			</Type>
		</MenuItem>
	</Menu>
}