import "./CategorySelectorDialog.scss";
import React from "react";
import cx from "classnames";
import { useCategorySelectorDialogController } from "./useCategorySelectorDialogController";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, InputAdornment, MenuItem, TextField } from "@material-ui/core";
import { Category } from "../../classes/Category";
import { Type } from "../Type/Type";
import { Search } from "@material-ui/icons";

export type CategorySelectorDialogProps = {
	onCategorySelected(category: Category): void;
	variant?: "income" | "expense";
} & DialogProps;

export function CategorySelectorDialog(props: CategorySelectorDialogProps) {

	const { onCategorySelected, ...DialogProps } = props

	const controller = useCategorySelectorDialogController(props)

	return <Dialog
		{...DialogProps}
		className={cx("CategorySelectorDialog", DialogProps?.className)}
	>
		<DialogTitle className="CategorySelectorDialog__Title">
			<Type variant="bold" color="gray-600">
				{"Select a category"}
			</Type>
		</DialogTitle>
		<DialogContent className="CategorySelectorDialog__Content">
			<ul>
				{
					controller.categories.map(category => {
						return <MenuItem
							key={category.id}
							onClick={() => props.onCategorySelected(category)}
						>
							<span className="icon">
								{
									category.icon || (props.variant === "income"
										? Category.defaultIncomeIcon
										: Category.defaultExpenseIcon)
								}
							</span>
							<Type className="name" variant="bold">
								{category.name}
							</Type>
						</MenuItem>
					})
				}
			</ul>
			<div className="search">
				<TextField
					value={controller.search}
					onChange={controller.handleSearchChange}
					label="Search"
					variant="outlined"
					size="small"
					fullWidth
					InputProps={{
						endAdornment: <InputAdornment position="end">
							<Search />
						</InputAdornment>
					}}
				/>
			</div>
		</DialogContent>
		<DialogActions className="CategorySelectorDialog__Actions">
			<Button>
				{"Close"}
			</Button>
		</DialogActions>
	</Dialog>
}