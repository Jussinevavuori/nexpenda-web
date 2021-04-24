import "./IntervalPickerForm.scss";
import React from "react"
import { IconButton, Button, Tooltip } from "@material-ui/core";
import {
	ArrowBack as PreviousIcon,
	ArrowForward as NextIcon,
	Today as NowIcon,
	DateRange as CalendarIcon
} from "@material-ui/icons";
import { Type } from "../Type/Type";
import { useIntervalPickerFormController } from "./useIntervalPickerFormController";

export type IntervalPickerFormProps = {
	onConfirm?(): void;
}

export function IntervalPickerForm(props: IntervalPickerFormProps) {

	const controller = useIntervalPickerFormController(props)

	return <div className="IntervalPickerForm">

		<section className="intervalLength">

			<Button
				variant="text"
				className={controller.isMonth ? "active" : ""}
				color={controller.isMonth ? "primary" : "default"}
				onClick={controller.onMonth}
				disabled={controller.isMonthDisabled}
			>
				{"Month"}
			</Button>

			<Button
				variant="text"
				className={controller.isYear ? "active" : ""}
				color={controller.isYear ? "primary" : "default"}
				onClick={controller.onYear}
				disabled={controller.isYearDisabled}
			>
				{"Year"}
			</Button>

			<Button
				variant="text"
				className={controller.isAll ? "active" : ""}
				color={controller.isAll ? "primary" : "default"}
				onClick={controller.onAll}
				disabled={controller.isAllDisabled}
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