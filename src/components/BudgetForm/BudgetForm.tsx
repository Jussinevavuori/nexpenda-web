import "./BudgetForm.scss";
import React from "react";
import cx from "classnames";
import { useBudgetFormController } from "./useBudgetFormController";
import { Type } from "../Type/Type";
import { Add as AddIcon, Clear } from "@material-ui/icons";
import { Button, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Budget } from "../../classes/Budget";
import { Category } from "../../classes/Category";
import { CategorySelectorDialog } from "../CategorySelectorDialog/CategorySelectorDialog";

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

		<CategorySelectorDialog
			open={controller.isSelectingCategory}
			onClose={controller.handleCancelSelectCategory}
			onCategorySelected={controller.onCategorySelected}
			variant={controller.variant}
		/>

		<form
			className={cx("BudgetForm")}
			onSubmit={controller.handleSubmit}
		>

			<div className="title">
				<Type
					variant="boldcaps"
					color="gray-600"
				>
					{
						controller.isEditing
							? `Edit ${controller.variant} budget`
							: `New ${controller.variant} budget`
					}
				</Type>
			</div>

			<div className="categories">
				<ul>
					{
						controller.selectedCategories.map(category => {
							return <li
								key={category.id}
								className="category"
							>
								<span className="icon">
									{
										category.icon || (controller.variant === "expense"
											? Category.defaultExpenseIcon
											: Category.defaultIncomeIcon)
									}
								</span>
								<Type component="span" variant="bold" className="name">
									{category.name}
								</Type>
								<IconButton
									size="small"
									onClick={() => controller.handleRemoveCategory(category)}
								>
									<Clear />
								</IconButton>
							</li>

						})
					}

					<Button
						variant="contained"
						color="secondary"
						onClick={controller.handleSelectCategory}
						startIcon={<AddIcon />}
					>
						{"Add category"}
					</Button>
				</ul>

			</div>

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