import "./MultiCategorySelector.scss";
import React from "react";
import cx from "classnames";
import { useMultiCategorySelectorController } from "./useMultiCategorySelectorController";
import { Autocomplete } from "@material-ui/lab";
import { TextField, TextFieldProps } from "@material-ui/core";
import { Category } from "../../classes/Category";

export type MultiCategorySelectorProps = {
	TextFieldProps?: TextFieldProps;
	value?: Category[];
	onChange?(value: Category[]): void;
};

export function MultiCategorySelector(props: MultiCategorySelectorProps) {

	const controller = useMultiCategorySelectorController(props)

	return <div className={cx("MultiCategorySelector")}>

		<div className="input">
			<Autocomplete
				value={props.value}
				onChange={
					props.onChange
						? (_, value) => props.onChange?.(value)
						: undefined
				}
				multiple
				id="transaction-category"
				openOnFocus
				autoHighlight
				selectOnFocus
				size="small"
				filterSelectedOptions
				fullWidth
				options={controller.categories}
				getOptionLabel={category => category.getFullLabel()}
				renderInput={(params) => (
					<TextField
						variant="outlined"
						label="Categories"
						placeholder="Pick a category"
						{...props.TextFieldProps}
						{...params}
					/>
				)}
			/>
		</div>

	</div>
}