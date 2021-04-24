import "./BudgetForm.scss";
import React from "react";
import cx from "classnames";
import { useBudgetFormController } from "./useBudgetFormController";
import { Type } from "../Type/Type";
import { Button, InputAdornment, TextField } from "@material-ui/core";
import { Budget } from "../../classes/Budget";
import { MultiCategorySelector } from "../MultiCategorySelector/MultiCategorySelector";

export type BudgetFormPropsVariant = {
	create?: undefined;
	edit: {
		budget: Budget;
	}
} | {
	edit?: undefined;
	create: {
		variant: "income" | "expense"
	}
}

export type BudgetFormProps = {
	variant: BudgetFormPropsVariant;
	onSubmitted?(): void;
};

export function BudgetForm(props: BudgetFormProps) {

	const controller = useBudgetFormController(props)

	return <>

		<form
			className={cx("BudgetForm")}
			onSubmit={controller.handleSubmit}
		>

			<div className="title">
				<Type variant="bold">
					{
						controller.isEditing
							? `Edit ${controller.variant} budget`
							: `New ${controller.variant} budget`
					}
				</Type>
			</div>

			<MultiCategorySelector
				value={controller.categories}
				onChange={controller.onCategoriesChange}
				TextFieldProps={{
					helperText: `Pick all categories you want to track under this budget.`
				}}
			/>

			<TextField
				variant="outlined"
				name="amount"
				type="number"
				label="Amount"
				error={!!controller.amountError}
				helperText={controller.amountError}
				fullWidth
				size="small"
				autoComplete="off"
				inputRef={controller.form.register}
				InputProps={{
					endAdornment: <InputAdornment position="end">
						<Type>
							{"EUR"}
						</Type>
					</InputAdornment>
				}}
			/>

			<TextField
				variant="outlined"
				name="label"
				type="text"
				label="Label (optional)"
				error={!!controller.labelError}
				helperText={controller.labelError}
				fullWidth
				inputRef={controller.form.register}
				size="small"
			/>

			{
				controller.error &&
				<Type color="red-600">
					{controller.error}
				</Type>
			}

			<Button
				color="primary"
				variant="contained"
				fullWidth
				onClick={controller.handleSubmit}
			>
				{controller.variant ? "Create" : "Save"}
			</Button>

		</form>

	</>
}