import "./IntegerInput.scss";
import React from "react";
import cx from "classnames";
import { useIntegerInputController } from "./useIntegerInputController";
import { ButtonTextFieldGroup } from "../ButtonTextFieldGroup/ButtonTextFieldGroup";
import { Button, ButtonGroup, TextField } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";

export type IntegerInputProps = {
	value: number;
	onChange(v: number): void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

export function IntegerInput(props: IntegerInputProps) {

	const controller = useIntegerInputController(props)

	return <ButtonTextFieldGroup className={cx("IntegerInput")}>

		<ButtonGroup size="small">
			<Button
				size="small"
				onClick={() => controller.addInt(-1)}
				disabled={props.disabled}
			>
				<Remove />
			</Button>
		</ButtonGroup>

		<TextField
			type="number"
			margin="none"
			value={controller.int}
			onChange={e => controller.setInt(e.target.value)}
			size="small"
			variant="outlined"
			disabled={props.disabled}
		/>

		<ButtonGroup size="small">
			<Button
				size="small"
				onClick={() => controller.addInt(1)}
				disabled={props.disabled}
			>
				<Add />
			</Button>
		</ButtonGroup>

	</ButtonTextFieldGroup>
}