import "./TransactionListFilters.scss";
import React from "react"
import { Button, ButtonGroup } from "@material-ui/core"
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon
} from "@material-ui/icons"

export type TransactionListFiltersViewProps = {
	onPreviousInterval(): void;
	onNextInterval(): void;
	onYearInterval(): void;
	onMonthInterval(): void;
	onWeekInterval(): void;
	startDate: Date;
	endDate: Date;
	isWeek: boolean;
	isMonth: boolean;
	isYear: boolean;
	intervalString: string;
}

export function TransactionListFiltersView(props: TransactionListFiltersViewProps) {
	return <div className="TransactionListFilters">

		<div className="date-selector">

			<ButtonGroup size="small">
				<Button
					size="small"
					variant="outlined"
					onClick={props.onPreviousInterval}
				>
					<ChevronLeftIcon />
				</Button>

				<Button
					size="small"
					className={props.isYear ? "selected-button" : ""}
					onClick={props.onYearInterval}
				>
					{"Year"}
				</Button>

				<Button
					size="small"
					className={props.isMonth ? "selected-button" : ""}
					onClick={props.onMonthInterval}
				>
					{"Month"}
				</Button>

				<Button
					size="small"
					className={props.isWeek ? "selected-button" : ""}
					onClick={props.onWeekInterval}
				>
					{"Week"}
				</Button>

				{/* <Button
					size="small"
					variant="outlined"
					startIcon={<CalendarIcon />}
				>
					{props.intervalString}
				</Button> */}

				<Button
					size="small"
					variant="outlined"
					onClick={props.onNextInterval}
				>
					<ChevronRightIcon />
				</Button>
			</ButtonGroup>
		</div>

	</div>
}