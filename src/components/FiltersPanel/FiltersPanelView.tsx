import "./FiltersPanel.scss";
import React, { useState } from "react"
import { Today as CalendarIcon, Sort as FilterIcon, ChevronLeft, ChevronRight } from "@material-ui/icons"
import { Button, IconButton, Menu, } from "@material-ui/core";
import { useLgMedia, useMdMedia } from "../../hooks/useMedia";
import { FiltersForm } from "../FiltersForm/FiltersFormController";
import { IntervalPickerForm } from "../IntervalPickerForm/IntervalPickerFormController";
import { useHashOpenState } from "../../hooks/useHashOpenState";
import { ResponsiveDrawer } from "../ResponsiveDrawer/ResponsiveDrawerController";

export type FiltersPanelViewProps = {
	intervalString: string;

	isDay: boolean;
	isWeek: boolean;
	isMonth: boolean;
	isYear: boolean;
	isAll: boolean;

	onDay(): void;
	onWeek(): void;
	onMonth(): void;
	onYear(): void;
	onAll(): void;

	onPrevious(): void;
	onNext(): void;

	includesToday: boolean;
	onNow(): void;
}

export function FiltersPanelView(props: FiltersPanelViewProps) {

	const [filtersFormDrawerOpen, setFiltersFormDrawerOpen] = useHashOpenState("filters")

	const [intervalPickerOpen, setIntervalPickerOpen] = useHashOpenState("interval")
	const [intervalPickerMenuAnchor, setIntervalPickerMenuAnchor] = useState<HTMLElement>()

	const mediumScreen = useMdMedia()

	const largeScreen = useLgMedia()

	return <>

		<ResponsiveDrawer
			open={filtersFormDrawerOpen}
			onClose={() => setFiltersFormDrawerOpen(false)}
			anchor={"right"}
		>
			<div className="FiltersPanel_filtersFormDrawer">
				<FiltersForm
					onConfirm={() => setFiltersFormDrawerOpen(false)}
				/>
			</div>
		</ResponsiveDrawer>

		{
			/**
			 * Render interval picker menu inside menu component
			 * on larger screens and bottom drawer on smaller screens.
			 */
			mediumScreen
				? <Menu
					open={!!intervalPickerMenuAnchor && intervalPickerOpen}
					onClose={() => {
						setIntervalPickerMenuAnchor(undefined)
						setIntervalPickerOpen(false)
					}}
					anchorEl={intervalPickerMenuAnchor}
				>
					<div className="FiltersPanel_intervalPickerMenu">
						<IntervalPickerForm
							onConfirm={() => {
								setIntervalPickerMenuAnchor(undefined)
								setIntervalPickerOpen(false)
							}}
						/>
					</div>
				</Menu>
				: <ResponsiveDrawer
					open={!!intervalPickerMenuAnchor && intervalPickerOpen}
					onClose={() => {
						setIntervalPickerMenuAnchor(undefined)
						setIntervalPickerOpen(false)
					}}
					anchor="bottom"
				>
					<div className="FiltersPanel_intervalPickerDrawer">
						<IntervalPickerForm
							onConfirm={() => {
								setIntervalPickerMenuAnchor(undefined)
								setIntervalPickerOpen(false)
							}}
						/>
					</div>
				</ResponsiveDrawer>
		}



		<div className="FiltersPanel">

			<div className="floatLeft">
				<Button
					variant="text"
					startIcon={<CalendarIcon />}
					onClick={e => {
						setIntervalPickerOpen(true)
						setIntervalPickerMenuAnchor(e.currentTarget)
					}}
				>
					{props.intervalString}
				</Button>
			</div>

			<div className="floatRight">

				{
					largeScreen &&
					<div className="intervalLength">
						<IconButton
							disabled={props.isAll}
							onClick={props.onPrevious}
						>
							<ChevronLeft />
						</IconButton>

						<Button
							variant="text"
							color={props.includesToday ? "primary" : "default"}
							onClick={props.onNow}
						>
							{"Now"}
						</Button>

						<IconButton
							disabled={props.isAll}
							onClick={props.onNext}
						>
							<ChevronRight />
						</IconButton>

						<Button
							variant="text"
							color={props.isDay ? "primary" : "default"}
							onClick={props.onDay}
						>
							{"Day"}
						</Button>

						<Button
							variant="text"
							color={props.isWeek ? "primary" : "default"}
							onClick={props.onWeek}
						>
							{"Week"}
						</Button>

						<Button
							variant="text"
							color={props.isMonth ? "primary" : "default"}
							onClick={props.onMonth}
						>
							{"Month"}
						</Button>

						<Button
							variant="text"
							color={props.isYear ? "primary" : "default"}
							onClick={props.onYear}
						>
							{"Year"}
						</Button>

						<Button
							variant="text"
							color={props.isAll ? "primary" : "default"}
							onClick={props.onAll}
						>
							{"All"}
						</Button>

					</div>
				}

				<div className="filtersButton">

					<Button
						variant={largeScreen ? "outlined" : "text"}
						endIcon={<FilterIcon />}
						onClick={() => setFiltersFormDrawerOpen(true)}
					>
						{"Filters"}
					</Button>

				</div>

			</div>

		</div>

	</>
}