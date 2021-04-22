import "./IntervalPickerForm.scss";
import React from "react"
import { IconButton, Button, Tooltip } from "@material-ui/core";
import {
	ArrowBack as PreviousIcon,
	ArrowForward as NextIcon,
	Today as NowIcon,
	DateRange as CalendarIcon
} from "@material-ui/icons";
// import { DatePicker } from "@material-ui/pickers";
import { Type } from "../Type/Type";
// import { MAXIMUM_DATE, MINIMUM_DATE } from "../../constants";
// import { DateUtils } from "../../utils/DateUtils/DateUtils";
import { useIntervalPickerFormController } from "./useIntervalPickerFormController";
import { ValidIntervalLengthType } from "../../models/interval.model";

export type IntervalPickerFormProps = {
	onConfirm?(): void;

	disabledLengths?: ValidIntervalLengthType[];
}

export function IntervalPickerForm(props: IntervalPickerFormProps) {

	const controller = useIntervalPickerFormController(props)

	return <div className="IntervalPickerForm">

		<section className="intervalLength">

			{/* <Button
				variant="text"
				color={controller.isDay ? "primary" : "default"}
				onClick={controller.onDay}
			>
				{"Day"}
			</Button>

			<Button
				variant="text"
				color={controller.isWeek ? "primary" : "default"}
				onClick={controller.onWeek}
			>
				{"Week"}
			</Button> */}

			<Button
				variant="text"
				className={controller.isMonth ? "active" : ""}
				color={controller.isMonth ? "primary" : "default"}
				onClick={controller.onMonth}
				disabled={props.disabledLengths?.includes("month")}
			>
				{"Month"}
			</Button>

			<Button
				variant="text"
				className={controller.isYear ? "active" : ""}
				color={controller.isYear ? "primary" : "default"}
				onClick={controller.onYear}
				disabled={props.disabledLengths?.includes("year")}
			>
				{"Year"}
			</Button>

			<Button
				variant="text"
				className={controller.isAll ? "active" : ""}
				color={controller.isAll ? "primary" : "default"}
				onClick={controller.onAll}
				disabled={props.disabledLengths?.includes("all")}
			>
				{"All"}
			</Button>

		</section>

		<section className="title">

			<div className="currentInterval">

				<CalendarIcon />

				<Type variant="bold">
					{controller.intervalString}
				</Type>

			</div>

			<div className="nextOrPreviousInterval">

				<Tooltip title={"Today"}>
					<IconButton onClick={controller.onNow}>
						<NowIcon />
					</IconButton>
				</Tooltip>

				<IconButton
					disabled={controller.isAll}
					onClick={controller.onPrevious}
				>
					<PreviousIcon />
				</IconButton>

				<IconButton
					disabled={controller.isAll}
					onClick={controller.onNext}
				>
					<NextIcon />
				</IconButton>

			</div>

		</section>
		{/* 
		<section className="dateSection">

			<DatePicker
				value={DateUtils.compareDate(controller.startDate, "==", MINIMUM_DATE) ? null : controller.startDate}
				onChange={d => controller.setStartDate(d as Date)}
				format="dd/MM/yyyy"
				inputVariant="outlined"
				variant="inline"
				size="small"
				label="From"
				fullWidth
			/>

			<DatePicker
				value={DateUtils.compareDate(controller.endDate, "==", MAXIMUM_DATE) ? null : controller.endDate}
				onChange={d => controller.setEndDate(d as Date)}
				format="dd/MM/yyyy"
				inputVariant="outlined"
				variant="inline"
				size="small"
				label="To"
				fullWidth
			/>

		</section> */}

		{
			props.onConfirm && <Button
				color="primary"
				variant="contained"
				fullWidth
				onClick={props.onConfirm}
			>
				{"OK"}
			</Button>
		}

	</div>
}