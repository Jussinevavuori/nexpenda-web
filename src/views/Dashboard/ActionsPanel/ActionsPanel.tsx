import "./ActionsPanel.scss";
import React from "react"
import cx from "classnames"
import {
	SelectAll as SelectAllIcon,
	CheckBox as SelectedAllIcon,
	Clear as DeselectAllIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Add as CreateIcon,
	Remove as RemoveIcon
} from "@material-ui/icons"
import { Button, IconButton, } from "@material-ui/core";
import { useMdMedia } from "../../../hooks/useMedia";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManager";
import { Type } from "../../../components/Type/Type";
import { useActionsPanelController } from "./useActionsPanelController";
import { TransactionsFilter } from "../../../components/TransactionsFilter/TransactionsFilter";

export type ActionsPanelProps = {
}

export function ActionsPanel(props: ActionsPanelProps) {

	const controller = useActionsPanelController(props)

	const isDesktopLayout = useMdMedia()

	/**
	 * Mobile selection layout
	 */
	if (!isDesktopLayout && controller.isSelectionActive) {
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
	else if (!isDesktopLayout && !controller.isSelectionActive) {
		return <div className={cx("ActionsPanel mobile default", {
			searchIsOpen: controller.isSearchOpen
		})}>
			<div className="intervalManager">
				<IntervalManager />
			</div>
			<div className="filterManager">
				<TransactionsFilter />
			</div>
		</div>
	}


	/**
	 * Desktop layout
	 */
	else {
		return <>
			<div className="ActionsPanel desktop">
				<div className="actionButtons">
					<Button
						variant="contained"
						color="primary"
						className="button createButton"
						startIcon={controller.createDrawerOpen ? <RemoveIcon /> : <CreateIcon />}
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
					<TransactionsFilter />
				</div>
			</div>
		</>
	}
}