import "./SchedulesManager.scss";
import React from "react";
import cx from "classnames";
import { useSchedulesManagerController } from "./useSchedulesManagerController";

export type SchedulesManagerProps = {

};

export function SchedulesManager(props: SchedulesManagerProps) {

	const controller = useSchedulesManagerController(props)

	return <div className={cx("SchedulesManager")}>

		{
			controller.schedules.length === 0
				? <p>
					{"You don't have any schedules"}
				</p>
				: <ul>
					{
						controller.schedules.map(schedule => (<li key={schedule.id}>
							<p>
								{`Schedule: ${schedule.id}, created at ${schedule.createdAt.toLocaleString()}`}
							</p>
							<p>
								{schedule.amount.format()}
								{` for category ${schedule.category.getFullLabel()}`}
								{` (${schedule.comment})`}
							</p>
							<p>
								{`From ${schedule.firstOccurrence.toLocaleDateString()} `}
								{`every ${schedule.intervalLength} ${schedule.intervalType}s`}
								{schedule.occurrences ? ` at most ${schedule.occurrences} times.` : `.`}
							</p>
						</li>))
					}
				</ul>
		}


	</div>
}