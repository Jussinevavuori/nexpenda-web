import "./IntervalManager.scss";
import React, { useState } from "react"
import { isMobile } from "react-device-detect"
import { Button, Drawer, IconButton, Menu } from "@material-ui/core";
import { ArrowBack, ArrowForward, DateRange, RadioButtonUnchecked as TodayIcon } from "@material-ui/icons"
import { useSmMedia } from "../../hooks/useMedia";
import { useHashOpenState } from "../../hooks/useHashOpenState";
import { IntervalPickerForm } from "../IntervalPickerForm/IntervalPickerFormController";

export type IntervalManagerViewProps = {

	hideControls?: boolean;

	intervalString: string;

	onPrevious(): void;
	onNext(): void;

	includesToday: boolean;
	onToday(): void;

}

export function IntervalManagerView(props: IntervalManagerViewProps) {

	const wideScreen = useSmMedia()
	const menuLayout = wideScreen && !isMobile
	const [intervalPickerOpen, setIntervalPickerOpen] = useHashOpenState("interval")
	const [intervalPickerMenuAnchor, setIntervalPickerMenuAnchor] = useState<HTMLElement>()

	const shouldShowControls = props.hideControls !== true

	return <>
		<div className="IntervalManager">
			{
				shouldShowControls && <div className="arrow-buttons">
					<IconButton onClick={props.onPrevious}>
						<ArrowBack />
					</IconButton>
					<IconButton onClick={props.onToday}>
						<TodayIcon />
					</IconButton>
					<IconButton onClick={props.onNext}>
						<ArrowForward />
					</IconButton>
				</div>
			}

			<Button
				className="date-button"
				startIcon={<DateRange />}
				onClick={e => {
					setIntervalPickerOpen(true)
					setIntervalPickerMenuAnchor(e.currentTarget)
				}}
			>
				{props.intervalString}
			</Button>
		</div>

		{
			/**
			 * Render interval picker menu inside menu component
			 * on larger screens and bottom drawer on smaller screens.
			 */
			menuLayout
				? <Menu
					open={!!intervalPickerMenuAnchor && intervalPickerOpen}
					onClose={() => {
						setIntervalPickerMenuAnchor(undefined)
						setIntervalPickerOpen(false)
					}}
					anchorEl={intervalPickerMenuAnchor}
					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
					transformOrigin={{ horizontal: "left", vertical: "top" }}
					getContentAnchorEl={null}
				>
					<div className="IntervalManager__Menu">
						<IntervalPickerForm
							onConfirm={() => {
								setIntervalPickerMenuAnchor(undefined)
								setIntervalPickerOpen(false)
							}}
						/>
					</div>
				</Menu>
				: <Drawer
					open={!!intervalPickerMenuAnchor && intervalPickerOpen}
					onClose={() => {
						setIntervalPickerMenuAnchor(undefined)
						setIntervalPickerOpen(false)
					}}
					anchor={"bottom"}
				>
					<div className="IntervalManager__Drawer">
						<IntervalPickerForm
							onConfirm={() => {
								setIntervalPickerMenuAnchor(undefined)
								setIntervalPickerOpen(false)
							}}
						/>
					</div>
				</Drawer>
		}

	</>
}