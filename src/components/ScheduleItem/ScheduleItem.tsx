import "./ScheduleItem.scss";
import React from "react";
import cx from "classnames";
import { useScheduleItemController } from "./useScheduleItemController";
import { TransactionSchedule } from "../../lib/DataModels/TransactionSchedule";
import { ContainerBlock } from "../Container/ContainerBlock";
import { MoneyType } from "../MoneyType/MoneyType";
import { Type } from "../Type/Type";
import { formatDateString } from "../../lib/Dates/formatDateString";
import { Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type ScheduleItemProps = {
	schedule: TransactionSchedule;
};

export function ScheduleItem(props: ScheduleItemProps) {

	const controller = useScheduleItemController(props)
	const isDarkTheme = useIsDarkTheme()

	return <ContainerBlock className={cx("ScheduleItem")}>

		{/* Amount and category */}
		<p className="title">
			<MoneyType
				colorIfPositive={"green-600"}
				colorIfNegative={"red-600"}
				amount={props.schedule.transactionTemplate.amount}
				size="md"
				component="span"
			/>
			<Type component="span">
				{props.schedule.transactionTemplate.category.getFullLabel(
					props.schedule.transactionTemplate.amount.sign
				)}
			</Type>
		</p>

		{/* Comment */}
		{
			props.schedule.transactionTemplate.comment &&
			<p className="description">
				<Type component="span" color={isDarkTheme ? "gray-400" : "gray-700"}>
					{props.schedule.transactionTemplate.comment}
				</Type>
			</p>
		}

		{/* Schedule */}
		<p className="scheduleTitle">
			<Type variant="bold" component="span">
				{
					[
						controller.isActive ? "Repeats" : "Repeated",
						`every ${props.schedule.schedule.formatInterval()}`
					].join(" ")
				}
			</Type>
		</p>

		{/* Schedule termination */}
		{
			controller.lastOccurrence &&
			<Type color={isDarkTheme ? "gray-400" : "gray-700"} size="sm">
				{
					[
						controller.isActive ? "Repeats" : "Repeated",
						props.schedule.schedule.occurrences
							? `${props.schedule.schedule.occurrences} times`
							: "",
						"until",
						formatDateString(controller.lastOccurrence),

					].join(" ")
				}
			</Type>
		}

		<div className="schedule">
			<div className="scheduleItem previous">
				<Type size="sm" color={isDarkTheme ? "gray-400" : "gray-700"}>
					<Type component="span" variant="bold" size="sm" color={isDarkTheme ? "gray-400" : "gray-700"}>
						{formatDateString(controller.previousOccurrence ?? new Date())}
					</Type>
					{controller.previousOccurrence ? (controller.isActive ? "Previous" : "Last") : "Today"}
				</Type>
			</div>
			{
				controller.isActive && controller.nextOccurrence && <>
					<div className="scheduleItem next">
						<Type size="sm" color={isDarkTheme ? "gray-400" : "gray-700"}>
							{`Next in ${controller.daysUntilNext} days`}
							<Type component="span" variant="bold" size="sm" color={isDarkTheme ? "gray-400" : "gray-700"}>
								{formatDateString(controller.nextOccurrence)}
							</Type>
						</Type>
					</div>
					<span
						className="now"
						style={{
							left: controller.progressUntilNextPercentage < 50
								? `${controller.progressUntilNextPercentage}%`
								: undefined,
							right: controller.progressUntilNextPercentage >= 50
								? `${100 - controller.progressUntilNextPercentage}%`
								: undefined,
						}}
					/>
				</>
			}
		</div>

		{/* Actions */}
		<div className="actions">
			{
				controller.isActive &&
				<Button
					className="edit"
					variant="outlined"
					onClick={() => controller.handleEditSchedule()}
					startIcon={<Edit />}
				>
					{"Edit"}
				</Button>
			}
			<DeleteButton
				deleteLabel={controller.isActive ? "Cancel" : "Delete"}
				deletingLabel={controller.isActive ? "Canceling..." : "Deleteing..."}
				onConfirm={() => controller.handleDeleteSchedule()}
			/>
		</div>

	</ContainerBlock >
}