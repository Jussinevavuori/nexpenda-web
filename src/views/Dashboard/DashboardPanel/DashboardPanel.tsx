import "./DashboardPanel.scss";
import React from "react";
import cx from "classnames";
import { useDashboardPanelController } from "./useDashboardPanelController";
import { ViewPanel } from "../../../components/ViewPanel/ViewPanel";
import {
	SelectAll as SelectAllIcon,
	CheckBox as SelectedAllIcon,
	Clear as DeselectAllIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
} from "@material-ui/icons"
import { IconButton } from "@material-ui/core";
import { IntervalManager } from "../../../components/IntervalManager/IntervalManager";
import { Type } from "../../../components/Type/Type";
import { TransactionsFilter } from "../../../components/TransactionsFilter/TransactionsFilter";
import { motion } from "framer-motion";
import { useMdMedia } from "../../../hooks/utils/useMedia";

export type DashboardPanelProps = {

};

export function DashboardPanel(props: DashboardPanelProps) {

	const controller = useDashboardPanelController(props)
	const isDesktopLayout = useMdMedia()

	return <ViewPanel className={cx("DashboardPanel", {
		searchIsOpen: controller.isSearchOpen,
	})}>
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
					<IntervalManager reverseControls={!isDesktopLayout} />
				</div>
		}

		<div className="filterManager">
			<TransactionsFilter />
		</div>
	</ViewPanel>
}