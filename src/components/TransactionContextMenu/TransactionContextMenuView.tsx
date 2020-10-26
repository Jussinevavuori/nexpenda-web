import "./TransactionContextMenu.scss";
import React from "react"
import { Transaction } from "../../classes/Transaction";
import { Menu, MenuItem } from "@material-ui/core";
import {
	SelectAll as SelectAllIcon,
	Clear as DeselectAllIcon,
	CheckBoxOutlineBlank as SelectIcon,
	CheckBox as DeselectIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
} from "@material-ui/icons";


export type TransactionContextMenuViewProps = {
	transaction?: Transaction;
	position?: { top: number, left: number };

	isAllSelected: boolean;
	onSelectAllToggle(): void;

	isSelected: boolean;
	onSelectToggle(): void;

	onEdit(): void;
	onDelete(): void;

	onClose(): void;
}

export function TransactionContextMenuView(props: TransactionContextMenuViewProps) {
	return <Menu
		className="TransactionContextMenu"
		open={!!props.position && !!props.transaction}
		anchorReference="anchorPosition"
		anchorPosition={props.position}
		onClose={props.onClose}
	>
		<MenuItem
			onClick={props.onEdit}
			className="editItem"
		>
			<EditIcon />
			{"Edit"}
		</MenuItem>
		<MenuItem
			onClick={props.onDelete}
			className="deleteItem"
		>
			<DeleteIcon />
			{"Delete"}
		</MenuItem>
		<MenuItem
			onClick={props.onSelectToggle}
			className="selectItem"
		>
			{props.isSelected ? <DeselectIcon /> : <SelectIcon />}
			{props.isSelected ? "Deselect" : "Select"}
		</MenuItem>
		<MenuItem
			onClick={props.onSelectAllToggle}
			className="selectAllItem"
		>
			{props.isAllSelected ? <DeselectAllIcon /> : <SelectAllIcon />}
			{props.isAllSelected ? "Deselect all" : "Select all"}
		</MenuItem>
	</Menu>
}