import "./DashboardActions.scss";
import React from "react";
import { useDashboardActionsController } from "./useDashboardActionsController";
import {
	Delete as DeleteIcon,
	Edit as EditIcon,
	Add as CreateIcon,
	Remove as RemoveIcon,
	MoreVert,
	GetApp as DownloadIcon
} from "@material-ui/icons"
import { Button, Menu, MenuItem } from "@material-ui/core";
import { Type } from "../../../components/Type/Type";
import { TransactionsFilter } from "../../../components/TransactionsFilter/TransactionsFilter";

export type DashboardActionsProps = {

};

export function DashboardActions(props: DashboardActionsProps) {
	const controller = useDashboardActionsController(props)

	return <>
		<Menu
			className="DashboardActions__moreMenu"
			open={controller.moreMenu.isMenuOpen}
			anchorEl={controller.moreMenu.anchorEl}
			onClose={controller.moreMenu.handleMenuClose}
		>
			<MenuItem
				className="menuItem downloadMenuItem"
				onClick={controller.handleDownload}
				disabled={controller.selection.length === 0}
			>
				<DownloadIcon />
				<Type variant="boldcaps">
					{"Download selected"}
				</Type>
			</MenuItem>
		</Menu>

		<div className="DashboardActions desktop">
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
							<Type variant="boldcaps">
								{"Delete"}
							</Type>
						</Button>
						<Button
							variant="outlined"
							className="button moreButton iconOnlyButton"
							startIcon={<MoreVert />}
							onClick={controller.moreMenu.handleMenuOpen}
						></Button>
					</>
				}
			</div>
			<div className="filtersButton">
				<TransactionsFilter />
			</div>
		</div>
	</>
}