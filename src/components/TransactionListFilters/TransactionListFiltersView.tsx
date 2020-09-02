import "./TransactionListFilters.scss";
import React from "react"
import { Button, ButtonGroup } from "@material-ui/core"
import {
	Sort as FilterIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon
} from "@material-ui/icons"

export type TransactionListFiltersViewProps = {
	onPreviousMonth(): void;
	onNextMonth(): void;
}

export function TransactionListFiltersView(props: TransactionListFiltersViewProps) {
	return <div className="TransactionListFilters">

		<div className="left">

			<ButtonGroup size="small">
				<Button size="small" variant="outlined" onClick={props.onPreviousMonth}>
					<ChevronLeftIcon />
				</Button>
				<Button size="small" variant="outlined" onClick={props.onNextMonth}>
					<ChevronRightIcon />
				</Button>
			</ButtonGroup>
		</div>

		<div className="right">
			<Button variant="outlined">
				<span>{"Filter"}</span>
				<FilterIcon />
			</Button>
		</div>

	</div>
}