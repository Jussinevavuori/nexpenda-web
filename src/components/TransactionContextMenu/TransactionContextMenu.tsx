import "./TransactionContextMenu.scss";
import React from "react"
import { Menu, MenuItem } from "@material-ui/core";
import {
	SelectAll as SelectAllIcon,
	Clear as DeselectAllIcon,
	CheckBoxOutlineBlank as SelectIcon,
	CheckBox as DeselectIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
} from "@material-ui/icons";
import { useTransactionContextMenuController } from "./useTransactionContextMenuController";


export type TransactionContextMenuProps = {
}

export function TransactionContextMenu(props: TransactionContextMenuProps) {

	const controller = useTransactionContextMenuController(props)

	return <Menu
		className="TransactionContextMenu"
		open={!!controller.position && !!controller.transaction}
		anchorReference="anchorPosition"
		anchorPosition={controller.position}
		onClose={controller.onClose}
	>
		<MenuItem
			onClick={controller.onEdit}
			className="editItem"
		>
			<EditIcon />
			{"Edit"}
		</MenuItem>
		<MenuItem
			onClick={controller.onDelete}
			className="deleteItem"
		>
			<DeleteIcon />
			{"Delete"}
		</MenuItem>
		<MenuItem
			onClick={controller.onSelectToggle}
			className="selectItem"
		>
			{controller.isSelected ? <DeselectIcon /> : <SelectIcon />}
			{controller.isSelected ? "Deselect" : "Select"}
		</MenuItem>
		<MenuItem
			onClick={controller.onSelectAllToggle}
			className="selectAllItem"
		>
			{controller.isAllSelected ? <DeselectAllIcon /> : <SelectAllIcon />}
			{controller.isAllSelected ? "Deselect all" : "Select all"}
		</MenuItem>
	</Menu>
}