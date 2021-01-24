import "./IntervalManager.scss";
import React from "react"
import { isMobile } from "react-device-detect"
import { Button, Drawer, IconButton, Menu } from "@material-ui/core";
import { ArrowBack, ArrowForward, DateRange, RadioButtonUnchecked as TodayIcon } from "@material-ui/icons"
import { useSmMedia } from "../../hooks/useMedia";
import { IntervalPickerForm } from "../IntervalPickerForm/IntervalPickerForm";
import { useIntervalManagerController } from "./useIntervalManagerController";

export type IntervalManagerProps = {
	hideControls?: boolean;
	reverseControls?: boolean;
	hideNowControl?: boolean;
}

export function IntervalManager(props: IntervalManagerProps) {

	const controller = useIntervalManagerController(props)

	const isDesktopLayout = useSmMedia()
	const menuLayout = isDesktopLayout && !isMobile

	const dateButton = <Button
		className="date-button"
		startIcon={<DateRange />}
		onClick={e => {
			controller.setIntervalPickerOpen(true)
			controller.setIntervalPickerMenuAnchor(e.currentTarget)
		}}
	>
		<span className="label">
			{controller.intervalLabel}
		</span>
	</Button>

	return <>


		<div className="IntervalManager">
			{props.reverseControls ? dateButton : null}
			{
				controller.shouldShowControls && <div className="arrow-buttons">
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
				</div>
			}
			{!props.reverseControls ? dateButton : null}
		</div>

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
					<div className="IntervalManager__Menu">
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
					<div className="IntervalManager__Drawer">
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