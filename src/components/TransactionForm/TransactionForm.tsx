import "./TransactionForm.scss";
import React, { useRef } from "react"
import { TextField, InputAdornment, Button, ButtonGroup } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { Type } from "../Type/Type";
import { useSmMedia } from "../../hooks/useMedia";
import { Transaction } from "../../classes/Transaction";
import { useTransactionFormController } from "./useTransactionFormController";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";

export type TransactionFormProps = {
	onClose?(): void;

	/**
	 * If this prop is provided, the editor will default to editing
	 * this transaction instead of creating a new transaction.
	 */
	editTransaction?: Transaction;

	variant?: "vertical" | "horizontal";

	hideTitle?: boolean;
}

export function TransactionForm(props: TransactionFormProps) {

	const amountInputRef = useRef<HTMLDivElement | null>(null)

	const controller = useTransactionFormController(props)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		controller.onSubmit()
	}

	const largerLayout = useSmMedia()

	return <form
		className={`TransactionForm ${props.variant || "vertical"}`}
		onSubmit={handleSubmit}
	>

		{
			props.hideTitle ? null : <Type className="title">
				{controller.edit ? "Edit transaction" : "New transaction"}
			</Type>
		}

		<div className="transactionAmountContainer">

			<ButtonGroup
				size="small"
			>
				<Button
					size="small"
					color="primary"
					variant={controller.sign === "+" ? "contained" : "outlined"}
					onClick={() => {
						controller.onSignChange("+")
						amountInputRef.current?.focus()
					}}
				>
					{"+"}
				</Button>
				<Button
					size="small"
					color="primary"
					variant={controller.sign === "-" ? "contained" : "outlined"}
					onClick={() => {
						controller.onSignChange("-")
						amountInputRef.current?.focus()
					}}
				>
					{"-"}
				</Button>
			</ButtonGroup>

			<TextField
				value={controller.amount}
				onChange={e => controller.onAmountChange(e.target.value)}
				onKeyDown={e => {
					switch (e.key) {
						case "-":
							controller.onSignChange("-")
							break;
						case "+":
							controller.onSignChange("+")
							break;
					}
				}}
				id="transaction-amount"
				variant="outlined"
				name="amount"
				type="number"
				label="Amount"
				error={!!controller.errors.amount}
				helperText={controller.errors.amount}
				fullWidth
				required
				size="small"
				autoFocus={!controller.edit}
				autoComplete="off"
				inputProps={{
					ref: amountInputRef,
				}}
				InputProps={{
					endAdornment: <InputAdornment position="end">
						<Type>
							{"EUR"}
						</Type>
					</InputAdornment>
				}}
			/>

		</div>

		<Autocomplete
			inputValue={controller.category}
			onInputChange={(e, v) => {
				controller.onCategoryChange(v)
			}}
			id="transaction-category"
			className="transaction-category"
			freeSolo
			openOnFocus
			autoHighlight
			selectOnFocus
			disableClearable
			size="small"
			autoComplete
			fullWidth
			options={controller.categories.map(_ => _.value)}
			renderInput={(params) => (
				<TextField
					variant="outlined"
					name="category"
					type="text"
					label="Category"
					autoComplete="off"
					error={!!controller.errors.category}
					helperText={controller.errors.category}
					required
					{...params}
				/>
			)}
		/>

		<TextField
			value={controller.comment}
			onChange={e => controller.onCommentChange(e.target.value)}
			id="transaction-comment"
			className="transaction-comment"
			variant="outlined"
			name="comment"
			type="text"
			label="Comment"
			error={!!controller.errors.comment}
			helperText={controller.errors.comment}
			fullWidth
			size="small"
		/>

		<KeyboardDatePicker
			value={controller.time}
			onChange={d => controller.onTimeChange(d as Date)}
			format="dd/MM/yyyy"
			id="transaction-time"
			className="transaction-time"
			variant={largerLayout ? "inline" : "dialog"}
			inputVariant="outlined"
			label="Date"
			error={!!controller.errors.time}
			helperText={controller.errors.time}
			fullWidth
			required
			size="small"
		/>

		<EnhancedButton
			type="submit"
			color="primary"
			variant="contained"
			className="submit"
			size="small"
			fullWidth
			loading={controller.loading}
		>
			{controller.edit ? "Save" : "Create"}
		</EnhancedButton>

	</form >
}