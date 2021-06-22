import "./ScheduleEditor.scss";
import React from "react";
import cx from "classnames";
import { TransactionSchedule } from "../../lib/DataModels/TransactionSchedule";
import { TransactionScheduleForm } from "../TransactionScheduleForm/TransactionScheduleForm";
import { Type } from "../Type/Type";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export type ScheduleEditorProps = {
	onClose?(): void;
	schedule: TransactionSchedule;
};

export function ScheduleEditor(props: ScheduleEditorProps) {
	return <div className={cx("ScheduleEditor")}>
		<Type>
			{"Edit transaction schedule"}
			<IconButton onClick={props.onClose}>
				<Close />
			</IconButton>
		</Type>
		<TransactionScheduleForm
			editTransactionSchedule={props.schedule}
			onClose={props.onClose}
		/>
	</div>
}