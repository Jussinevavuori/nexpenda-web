import "./IntervalManager.scss";
import React from "react"
import { isMobile } from "react-device-detect"
import { Button, Drawer, IconButton, Menu } from "@material-ui/core";
import { ArrowBack, ArrowForward, DateRange, RadioButtonUnchecked as TodayIcon } from "@material-ui/icons"
import { useSmMedia } from "../../hooks/useMedia";
import { IntervalPickerForm } from "../IntervalPickerForm/IntervalPickerForm";
import { useIntervalManagerController } from "./useIntervalManagerController";
import { createClassnames } from "../../utils/Utils/createClassnames";
import { motion } from "framer-motion"

export type IntervalManagerProps = {
	hideControls?: boolean;
	reverseControls?: boolean;
	hideNowControl?: boolean;
}

export function IntervalManager(props: IntervalManagerProps) {

	const cx = createClassnames({
		controlsHidden: props.hideControls,
		controlsReversed: props.reverseControls,
		nowControlHidden: props.hideControls
	})

	const controller = useIntervalManagerController(props)

	const isDesktopLayout = useSmMedia()
	const menuLayout = isDesktopLayout && !isMobile

	const dateButton = <motion.div layout="position">
		<Button
			className={cx("date-button")}
			startIcon={<DateRange />}
			onClick={e => {
				controller.setIntervalPickerOpen(true)
				controller.setIntervalPickerMenuAnchor(e.currentTarget)
			}}
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
					{
						props.hideNowControl
							? null
							: <IconButton onClick={controller.handleToday}>
								<TodayIcon />
							</IconButton>
					}
					<IconButton onClick={controller.handleNext}>
						<ArrowForward />
					</IconButton>
				</motion.div>
			}
			{!props.reverseControls ? dateButton : null}
		</motion.div>

		{
			/**
			 * Render interval picker menu inside menu component
			 * on larger screens and bottom drawer on smaller screens.
			 */
			menuLayout
				? <Menu
					open={!!controller.intervalPickerMenuAnchor && controller.intervalPickerOpen}
					onClose={() => {
						controller.setIntervalPickerMenuAnchor(undefined)
						controller.setIntervalPickerOpen(false)
					}}
					anchorEl={controller.intervalPickerMenuAnchor}
					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
					transformOrigin={{ horizontal: "left", vertical: "top" }}
					getContentAnchorEl={null}
				>
					<div className={cx("IntervalManager__Menu")}>
						<IntervalPickerForm
							onConfirm={() => {
								controller.setIntervalPickerMenuAnchor(undefined)
								controller.setIntervalPickerOpen(false)
							}}
						/>
					</div>
				</Menu>
				: <Drawer
					open={!!controller.intervalPickerMenuAnchor && controller.intervalPickerOpen}
					onClose={() => {
						controller.setIntervalPickerMenuAnchor(undefined)
						controller.setIntervalPickerOpen(false)
					}}
					anchor={"bottom"}
				>
					<div className={cx("IntervalManager__Drawer")}>
						<IntervalPickerForm
							onConfirm={() => {
								controller.setIntervalPickerMenuAnchor(undefined)
								controller.setIntervalPickerOpen(false)
							}}
						/>
					</div>
				</Drawer>
		}

	</>
}