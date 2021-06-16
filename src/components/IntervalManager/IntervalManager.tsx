import "./IntervalManager.scss";
import React from "react"
import { Button, IconButton, } from "@material-ui/core";
import { ArrowBack, ArrowForward, DateRange } from "@material-ui/icons"
import { IntervalPickerForm } from "../IntervalPickerForm/IntervalPickerForm";
import { useIntervalManagerController } from "./useIntervalManagerController";
import { createClassnames } from "../../utils/Utils/createClassnames";
import { motion } from "framer-motion"
import { ResponsiveMenu } from "../ResponsiveMenu/ResponsiveMenu";

export type IntervalManagerProps = {
	hideControls?: boolean;
	reverseControls?: boolean;
};

export function IntervalManager(props: IntervalManagerProps) {

	const cx = createClassnames({
		controlsHidden: props.hideControls,
		controlsReversed: props.reverseControls,
		nowControlHidden: props.hideControls
	})

	const controller = useIntervalManagerController(props)

	const dateButton = <motion.div layout="position">
		<Button
			className={cx("date-button")}
			startIcon={<DateRange />}
			onClick={e => controller.menuState.handleOpen(e)}
		>
			<span className={cx("label")}>
				{controller.intervalLabel}
			</span>
		</Button>
	</motion.div>

	return <>


		<motion.div className={cx("IntervalManager")}>
			{props.reverseControls ? dateButton : null}
			{
				controller.shouldShowControls &&
				<motion.div layout="position" className={cx("arrow-buttons")}>
					<IconButton onClick={controller.handlePrevious}>
						<ArrowBack />
					</IconButton>
					<IconButton onClick={controller.handleNext}>
						<ArrowForward />
					</IconButton>
				</motion.div>
			}
			{!props.reverseControls ? dateButton : null}
		</motion.div>

		<ResponsiveMenu
			open={controller.menuState.isOpen}
			onClose={controller.menuState.handleClose}
			MenuProps={{
				anchorEl: controller.menuState.anchorEl,
				anchorOrigin: { horizontal: "left", vertical: "bottom" },
				transformOrigin: { horizontal: "left", vertical: "top" },
				getContentAnchorEl: null,
			}}
			DrawerProps={{
				anchor: "bottom"
			}}
		>
			{
				(renderProps) => <div
					className={cx(renderProps.variant === "menu"
						? "IntervalManager__Menu"
						: "IntervalManager__Drawer"
					)}>
					<IntervalPickerForm onConfirm={controller.menuState.handleClose} />
				</div>
			}
		</ResponsiveMenu>
	</>
}