import "./SchedulesEmpty.scss";
import React from "react";
import cx from "classnames";
// import { useSchedulesEmptyController } from "./useSchedulesEmptyController";
import { Type } from "../Type/Type";
import { ContainerBlock } from "../Container/ContainerBlock";
import { Replay } from "@material-ui/icons";

export type SchedulesEmptyProps = {

};

export function SchedulesEmpty(props: SchedulesEmptyProps) {

	// const controller = useSchedulesEmptyController(props)

	return <ContainerBlock className={cx("SchedulesEmpty")}>
		<Type component="h2" variant="bold">
			{"You don't have any transaction schedules."}
		</Type>
		<Type>
			<span>
				{"You can create transaction schedules either from here or by creating "}
				{"a new transaction and pressing the "}
			</span>
			<i>
				<Replay />
			</i>
			<span>
				{" button next to the date field."}
			</span>
		</Type>
		<div className="description">
			<Type variant="bold">
				{"What are transaction schedules?"}
			</Type>
			<Type>
				{"Transaction schedules allow you to define recurring transactions "}
				{"which are automatically created for you, for example your monthly "}
				{"rent expenses or paychecks."}
			</Type>
		</div>
	</ContainerBlock>
}