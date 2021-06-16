import "./BudgetForm.scss";
import React from "react";
import cx from "classnames";
import { useBudgetFormController } from "./useBudgetFormController";
import { Type } from "../Type/Type";
import { Button, Collapse, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Budget } from "../../classes/Budget";
import { MultiCategorySelector } from "../MultiCategorySelector/MultiCategorySelector";
import { ExpandMore } from "@material-ui/icons";
import { motion } from "framer-motion";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

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
	const isDarkTheme = useIsDarkTheme()

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


			<div className="inputContainer">
				<Type size="sm" className="label">
					{`Pick all categories you want to track under this budget.`}
				</Type>

				<MultiCategorySelector
					value={controller.categories}
					onChange={controller.onCategoriesChange}
				/>
			</div>


			<div className="inputContainer">
				<Type size="sm" className="label">
					{
						controller.variant === "expense"
							? `Estimate how much you'll be spending on the selected categories monthly. `
							: `Estimate how much income the selected categories will generate monthly. `
					}
				</Type>

				<Type
					size="sm"
					className="label"
					color={isDarkTheme ? "gray-600" : "gray-700"}
				>
					{`(Or during the specified budget period.)`}
				</Type>

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
			</div>

			<div className="showMore">
				<Type
					component="span"
					onClick={controller.expansion.handleToggle}
				>
					{"More options"}
				</Type>
				<motion.span animate={{ rotate: controller.expansion.isOpen ? 180 : 0 }}>
					<IconButton onClick={controller.expansion.handleToggle}>
						<ExpandMore />
					</IconButton>
				</motion.span>
			</div>

			<Collapse
				in={controller.expansion.isOpen}
				timeout="auto"
				unmountOnExit
			>
				<div className="moreOptions">

					<div className="inputContainer">
						<Type size="sm" className="label">
							{`Give your budget an optional nickname.`}
						</Type>

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
					</div>

					<div className="inputContainer">
						<Type size="sm" className="label">
							{`Select the period of your budget in months.`}
						</Type>

						<Type
							size="sm"
							className="label"
							color={isDarkTheme ? "gray-600" : "gray-700"}
						>
							{`For example, you can set this to 2 months for expenses which `}
							{`occur regularly every second month.`}
						</Type>

						<TextField
							variant="outlined"
							name="periodMonths"
							type="number"
							label="Budget period (months)"
							error={!!controller.periodError}
							helperText={controller.periodError}
							fullWidth
							size="small"
							autoComplete="off"
							inputRef={controller.form.register}
							defaultValue={1}
							InputProps={{
								endAdornment: <InputAdornment position="end">
									<Type>
										{"(Months)"}
									</Type>
								</InputAdornment>
							}}
						/>
					</div>
				</div>
			</Collapse>

			{
				controller.error &&
				<Type color={isDarkTheme ? "red-400" : "red-600"}>
					{controller.error}
				</Type>
			}

			<Button
				color="primary"
				variant="contained"
				fullWidth
				onClick={controller.handleSubmit}
			>
				{controller.isEditing ? "Save" : "Create"}
			</Button>

		</form>

	</>
}