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
import { Type } from "../../../components/Type/Type";
import { useActionsPanelController } from "./useActionsPanelController";

export type ActionsPanelProps = {
}

export function ActionsPanel(props: ActionsPanelProps) {

	const controller = useActionsPanelController(props)

	const desktopLayout = useMdMedia()

	/**
	 * Mobile layout
	 */

	if (!desktopLayout) {

		/**
		 * Mobile selection layout
		 */

		if (controller.isSelectionActive) {
			return <div className="ActionsPanel mobile selection">

				<div className="selection-info">

					<IconButton
						onClick={controller.handleDeselectAll}
						children={<DeselectAllIcon />}
					/>
					<Type variant="boldcaps" color="gray-800">
						{`${controller.selection.length} selected`}
					</Type>

				</div>

				<div className="selection-actions">

					{
						controller.allSelected
							? <IconButton
								onClick={controller.handleDeselectAll}
								children={<SelectedAllIcon />}
							/>
							: <IconButton
								onClick={controller.handleSelectAll}
								children={<SelectAllIcon />}
							/>
					}
					<IconButton
						className="editButton"
						disabled={controller.selection.length !== 1}
						onClick={controller.handleEdit}
						children={<EditIcon />}
					/>
					<IconButton
						className="deleteButton"
						disabled={controller.selection.length === 0}
						onClick={controller.handleDelete}
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
					<IntervalManager hideControls />
				</div>

				<div className="filterManager">
					<IconButton
						className="filterButton"
						onClick={controller.handleFilter}
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
						onClick={controller.handleCreate}
					>
						<Type variant="boldcaps" color="white">
							{"New transaction"}
						</Type>
					</Button>

					{
						controller.isSelectionActive && <>
							<Button
								variant="outlined"
								className="button editButton"
								startIcon={<EditIcon />}
								onClick={controller.handleEdit}
								disabled={controller.selection.length !== 1}
							>
								<Type variant="boldcaps" >
									{"Edit"}
								</Type>
							</Button>
							<Button
								variant="outlined"
								className="button deleteButton"
								startIcon={<DeleteIcon />}
								onClick={controller.handleDelete}
								disabled={controller.selection.length === 0}
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
						onClick={controller.handleFilter}
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