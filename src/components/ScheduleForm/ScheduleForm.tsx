import "./ScheduleForm.scss";
import React from "react";
import cx from "classnames";
import { format } from "date-fns"
import { useScheduleFormController } from "./useScheduleFormController";
import { Select, MenuItem, FormControl, Switch } from "@material-ui/core";
import { Type } from "../Type/Type";
import { IntegerInput } from "../IntegerInput/IntegerInput";
import { ScheduleFormType } from "../../utils/FormUtils/scheduleFormField";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type ScheduleFormProps = {
	fromDate: Date;
	value: ScheduleFormType;
	onChange(s: ScheduleFormType): void;
};

export function ScheduleForm(props: ScheduleFormProps) {
	const controller = useScheduleFormController(props)
	const isDarkTheme = useIsDarkTheme()

	return <div className={cx("ScheduleForm")}>

		<div className="repeatEvery">
			<Type className="title" color={isDarkTheme ? "gray-300" : "gray-800"}>
				{"Repeat every"}
				<Switch
					className="switch"
					checked={props.value.enabled}
					onChange={(e) => props.onChange({ ...props.value, enabled: e.target.checked })}
				/>
			</Type>

			<div className={cx("inputs", { dim: !props.value.enabled })}>
				<IntegerInput
					min={1}
					disabled={!props.value.enabled}
					value={props.value.every}
					onChange={every => props.onChange({ ...props.value, every })}
				/>

				<FormControl variant="outlined" size="small">
					<Select
						value={props.value.type}
						onChange={(e) => props.onChange({ ...props.value, type: e.target.value as ScheduleFormType["type"] })}
						disabled={!props.value.enabled}
					>
						<MenuItem value="DAY">{pluralize("Day", props.value.every > 1)}</MenuItem>
						<MenuItem value="WEEK">{pluralize("Week", props.value.every > 1)}</MenuItem>
						<MenuItem value="MONTH">{pluralize("Month", props.value.every > 1)}</MenuItem>
						<MenuItem value="YEAR">{pluralize("Year", props.value.every > 1)}</MenuItem>
					</Select>
				</FormControl>
			</div>
		</div>

		<div className="endsAfter">
			<Type className="title" color={isDarkTheme ? "gray-300" : "gray-800"}>
				{"End after"}
				<Switch
					className="switch"
					checked={controller.isOccurrencesEnabled}
					onChange={(e) => controller.setIsOccurrencesEnabled(e.target.checked)}
					disabled={!props.value.enabled}
				/>
			</Type>
			{
				controller.isOccurrencesEnabled && <>
					<div className="inputs">
						<IntegerInput
							min={1}
							value={props.value.occurrences}
							onChange={occurrences => props.onChange({ ...props.value, occurrences })}
						/>
						<Type className="endson" color={isDarkTheme ? "gray-400" : "gray-700"}>
							{`occurrences`}
						</Type>
					</div>
					{
						controller.untilDate &&
						<Type className="endson" color={isDarkTheme ? "gray-400" : "gray-700"}>
							{`Ends on: ${format(controller.untilDate, "d.M.yyyy")}`}
						</Type>
					}
				</>
			}
		</div>

	</div>
}

function pluralize(word: string, when: boolean) {
	return when ? `${word}s` : word
}