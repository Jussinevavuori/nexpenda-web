import "./IntervalPickerForm.scss";
import React from "react"
import { IconButton, Button, Divider } from "@material-ui/core";
import { ChevronLeft, ChevronRight, Today as CalendarIcon } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { Type } from "../Type/Type";
import { MAXIMUM_DATE, MINIMUM_DATE } from "../../constants";
import { DateUtils } from "../../utils/DateUtils/DateUtils";

export type IntervalPickerFormViewProps = {
	onConfirm?(): void;

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

	startDate: Date;
	endDate: Date;

	setStartDate(value: Date): void;
	setEndDate(value: Date): void;
}

export function IntervalPickerFormView(props: IntervalPickerFormViewProps) {
	return <div className="IntervalPickerForm">

		<section className="title">

			<div className="currentInterval">

				<CalendarIcon />

				<Type>
					{props.intervalString}
				</Type>

			</div>

			<div className="nextOrPreviousInterval">

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

			</div>

		</section>

		<Divider />

		<section className="intervalLength">

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

		</section>

		<section className="dateSection">

			<DatePicker
				value={DateUtils.compareDate(props.startDate, "==", MINIMUM_DATE) ? null : props.startDate}
				onChange={d => props.setStartDate(d as Date)}
				format="dd/MM/yyyy"
				inputVariant="outlined"
				variant="inline"
				size="small"
				label="From"
				fullWidth
			/>

		</section>

		<section className="dateSection">

			<DatePicker
				value={DateUtils.compareDate(props.endDate, "==", MAXIMUM_DATE) ? null : props.endDate}
				onChange={d => props.setEndDate(d as Date)}
				format="dd/MM/yyyy"
				inputVariant="outlined"
				variant="inline"
				size="small"
				label="To"
				fullWidth
			/>

		</section>

		{
			props.onConfirm && <Button
				color="primary"
				variant="contained"
				fullWidth
				onClick={props.onConfirm}
			>
				{"Ok"}
			</Button>
		}

	</div>
}