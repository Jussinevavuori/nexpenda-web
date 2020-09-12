import "./FiltersPanel.scss";
import React, { useState } from "react"
import { Today as CalendarIcon, Sort as FilterIcon, ChevronLeft, ChevronRight } from "@material-ui/icons"
import { Button, Drawer, IconButton, Menu, } from "@material-ui/core";
import { useLgMedia, useMdMedia } from "../../hooks/useMedia";
import { FiltersForm } from "../FiltersForm/FiltersFormController";
import { IntervalPickerForm } from "../IntervalPickerForm/IntervalPickerFormController";

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

	const [filtersFormDrawerOpen, setFiltersFormDrawerOpen] = useState(false)

	const [intervalPickerMenuAnchor, setIntervalPickerMenuAnchor] = useState<HTMLElement>()

	const mediumScreen = useMdMedia()

	const largeScreen = useLgMedia()

	return <>

		<Drawer
			open={filtersFormDrawerOpen}
			onClose={() => setFiltersFormDrawerOpen(false)}
			anchor={largeScreen ? "right" : "bottom"}
		>
			<div className="FiltersPanel_filtersFormDrawer">
				<FiltersForm
					onConfirm={() => setFiltersFormDrawerOpen(false)}
				/>
			</div>
		</Drawer>

		{
			/**
			 * Render interval picker menu inside menu component
			 * on larger screens and bottom drawer on smaller screens.
			 */
			mediumScreen
				? <Menu
					open={!!intervalPickerMenuAnchor}
					onClose={() => setIntervalPickerMenuAnchor(undefined)}
					anchorEl={intervalPickerMenuAnchor}
				>
					<div className="FiltersPanel_intervalPickerMenu">
						<IntervalPickerForm
							onConfirm={() => setIntervalPickerMenuAnchor(undefined)}
						/>
					</div>
				</Menu>
				: <Drawer
					open={!!intervalPickerMenuAnchor}
					onClose={() => setIntervalPickerMenuAnchor(undefined)}
					anchor="bottom"
				>
					<div className="FiltersPanel_intervalPickerDrawer">
						<IntervalPickerForm
							onConfirm={() => setIntervalPickerMenuAnchor(undefined)}
						/>
					</div>
				</Drawer>
		}



		<div className="FiltersPanel">

			<div className="floatLeft">
				<Button
					variant="text"
					startIcon={<CalendarIcon />}
					onClick={e => setIntervalPickerMenuAnchor(e.currentTarget)}
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