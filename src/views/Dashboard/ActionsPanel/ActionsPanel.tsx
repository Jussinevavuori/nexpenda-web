import "./ActionsPanel.scss";
import React from "react"
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
import { useMdMedia, useSmMedia } from "../../../hooks/utils/useMedia";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManager";
import { Type } from "../../../components/Type/Type";
import { useActionsPanelController } from "./useActionsPanelController";
import { TransactionsFilter } from "../../../components/TransactionsFilter/TransactionsFilter";
import { createClassnames } from "../../../utils/Utils/createClassnames";
import { motion } from "framer-motion";

export type ActionsPanelProps = {
}

export function ActionsPanel(props: ActionsPanelProps) {

	const controller = useActionsPanelController(props)

	const isDesktopLayout = useMdMedia()
	const isLargeMobileLayout = useSmMedia()

	const cx = createClassnames({
		mobile: !isDesktopLayout,
		desktop: isDesktopLayout,
		selection: controller.isSelectionActive,
		searchIsOpen: controller.isSearchOpen,
	})

	/**
	 * Mobile layout
	 */
	if (!isDesktopLayout) {
		return <div className={cx("ActionsPanel")}>
			{
				controller.isSelectionActive
					? <motion.div layout="position" className="selection-container">
						<motion.div layout="position" className="selection-info">
							<IconButton
								onClick={controller.handleDeselectAll}
								children={<DeselectAllIcon />}
							/>
							<Type variant="boldcaps" color="gray-800">
								{`${controller.selection.length} selected`}
							</Type>
						</motion.div>
						<motion.div layout="position" className="selection-actions">
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
						</motion.div>
					</motion.div>
					: <div className="intervalManager">
						<IntervalManager
							reverseControls={!isDesktopLayout}
							hideNowControl={!isLargeMobileLayout}
						/>
					</div>
			}

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