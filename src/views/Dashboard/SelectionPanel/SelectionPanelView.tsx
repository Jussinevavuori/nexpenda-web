import "./SelectionPanel.scss";
import React from "react"
import { Transaction } from "../../../classes/Transaction";
import { useMdMedia } from "../../../hooks/useMedia";
import { Button, IconButton } from "@material-ui/core";
import {
	SelectAll as SelectAllIcon,
	CheckBox as SelectedAllIcon,
	Clear as DeselectAllIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
} from "@material-ui/icons";
import { Type } from "../../../components/Type/Type";

export type SelectionPanelViewProps = {

	selection: Transaction[];
	allSelected: boolean;
	onSelectAll(): void;
	onDeselectAll(): void;
	onDelete(): void;
	onEdit(): void;

}

export function SelectionPanelView(props: SelectionPanelViewProps) {

	const isDesktopLayout = useMdMedia()

	return <div className="SelectionPanel">

		<div className="floatLeft">
			<IconButton
				onClick={props.onDeselectAll}
				children={<DeselectAllIcon />}
			/>
			<Type>
				{`${props.selection.length} selected`}
			</Type>
		</div>

		<div className="floatRight">
			{
				isDesktopLayout
					? <>
						{
							props.allSelected
								? <Button
									onClick={props.onDeselectAll}
									startIcon={<SelectedAllIcon />}
									children={"Select all"}
								/>
								: <Button
									onClick={props.onSelectAll}
									startIcon={<SelectAllIcon />}
									children={"Select all"}
								/>
						}

						<Button
							className="editButton"
							disabled={props.selection.length !== 1}
							onClick={props.onEdit}
							startIcon={<EditIcon />}
							children={"Edit"}
						/>

						<Button
							className="deleteButton"
							onClick={props.onDelete}
							startIcon={<DeleteIcon />}
							children={"Delete"}
						/>
					</>
					: <>
						{
							props.allSelected
								? <IconButton
									onClick={props.onDeselectAll}
									children={<SelectedAllIcon />}
								/>
								: <IconButton
									onClick={props.onSelectAll}
									children={<SelectAllIcon />}
								/>
						}
						<IconButton
							className="editButton"
							disabled={props.selection.length !== 1}
							onClick={props.onEdit}
							children={<EditIcon />}
						/>
						<IconButton
							className="deleteButton"
							onClick={props.onDelete}
							children={<DeleteIcon />}
						/>
					</>
			}
		</div>

	</div>
}