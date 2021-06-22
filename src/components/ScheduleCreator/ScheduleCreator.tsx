import "./ScheduleCreator.scss";
import React from "react";
import cx from "classnames";
import { Type } from "../Type/Type";
import { TransactionScheduleForm } from "../TransactionScheduleForm/TransactionScheduleForm";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export type ScheduleCreatorProps = {
	onClose?(): void;
};

export function ScheduleCreator(props: ScheduleCreatorProps) {
	return <div className={cx("ScheduleCreator")}>
		<Type>
			{"Create new transaction schedule"}
			<IconButton onClick={props.onClose}>
				<Close />
			</IconButton>
		</Type>
		<TransactionScheduleForm
			onClose={props.onClose}
		/>
	</div>
}