import "./ActionsPanel.scss";
import React from "react"
import {
	FilterList as FilterIcon,
	SelectAll as SelectAllIcon,
	CheckBox as SelectedAllIcon,
	Clear as DeselectAllIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Add as CreateIcon
} from "@material-ui/icons"
import { Button, IconButton, } from "@material-ui/core";
import { useMdMedia } from "../../../hooks/useMedia";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManagerController";
import { Transaction } from "../../../classes/Transaction";
import { Type } from "../../../components/Type/Type";

export type ActionsPanelViewProps = {
	onCreate(): void;

	onFilter(): void;

	isSelectionActive: boolean;
	selection: Transaction[];
	allSelected: boolean;
	onSelectAll(): void;
	onDeselectAll(): void;
	onDelete(): void;
	onEdit(): void;
}

export function ActionsPanelView(props: ActionsPanelViewProps) {

	const desktopLayout = useMdMedia()

	/**
	 * Mobile layout
	 */

	if (!desktopLayout) {

		/**
		 * Mobile selection layout
		 */

		if (props.isSelectionActive) {
			return <div className="ActionsPanel mobile selection">

				<div className="selection-info">

					<IconButton
						onClick={props.onDeselectAll}
						children={<DeselectAllIcon />}
					/>
					<Type variant="boldcaps" color="gray-800">
						{`${props.selection.length} selected`}
					</Type>

				</div>

				<div className="selection-actions">

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
						disabled={props.selection.length === 0}
						onClick={props.onDelete}
						children={<DeleteIcon />}
					/>

				</div>

			</div>
		}

		/**
		 * Mobile default layout
		 */
		else {
			return <div className="ActionsPanel mobile default">

				<div className="intervalManager">
					<IntervalManager hideArrowButtons />
				</div>

				<div className="filterManager">
					<IconButton
						className="filterButton"
						onClick={props.onFilter}
						children={<FilterIcon />}
					/>
				</div>

			</div>
		}

	}

	/**
	 * Desktop layout
	 */
	else {
		return <>

			<div className="ActionsPanel desktop">

				<div>

					<Button
						variant="contained"
						color="primary"
						className="button createButton"
						startIcon={<CreateIcon />}
						onClick={props.onCreate}
					>
						<Type variant="boldcaps" color="white">
							{"New transaction"}
						</Type>
					</Button>

					{
						props.isSelectionActive && <>
							<Button
								variant="outlined"
								className="button editButton"
								startIcon={<EditIcon />}
								onClick={props.onEdit}
								disabled={props.selection.length !== 1}
							>
								<Type variant="boldcaps" >
									{"Edit"}
								</Type>
							</Button>
							<Button
								variant="outlined"
								className="button deleteButton"
								startIcon={<DeleteIcon />}
								onClick={props.onDelete}
								disabled={props.selection.length === 0}
							>
								<Type variant="boldcaps" >
									{"Delete"}
								</Type>
							</Button>
						</>
					}

				</div>

				<div className="filtersButton">
					<Button
						variant="outlined"
						className="button filterButton"
						startIcon={<FilterIcon />}
						onClick={props.onFilter}
					>
						<Type variant="boldcaps" >
							{"Filter"}
						</Type>
					</Button>
				</div>

			</div>

		</>
	}
}