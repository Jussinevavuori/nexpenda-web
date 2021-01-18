import "./TransactionForm.scss";
import React, { useRef } from "react"
import { TextField, InputAdornment, Button, ButtonGroup } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { Type } from "../Type/Type";
import { useSmMedia } from "../../hooks/useMedia";
import { Category } from "../../classes/Category";

export type TransactionFormViewProps = {

	onSubmit(): Promise<void>;

	/**
	 * Form state
	 */
	amount: string;
	sign: "+" | "-";
	category: string;
	time: Date;
	comment: string;

	/**
	 * Form change handlers
	 */
	onSignChange(sign: "+" | "-"): void;
	onAmountChange(value: string): void;
	onCategoryChange(value: string): void;
	onTimeChange(value: Date): void;
	onCommentChange(value: string): void;

	/**
	 * Form errors
	 */
	errors: {
		main?: string;
		amount?: string;
		category?: string;
		time?: string;
		comment?: string;
	};

	categories: Category[];

	edit: boolean;

}

export function TransactionFormView(props: TransactionFormViewProps) {

	const amountInputRef = useRef<HTMLDivElement | null>(null)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		props.onSubmit()
	}

	const largerLayout = useSmMedia()

	return <form className="TransactionForm" onSubmit={handleSubmit}>

		<Type >
			{props.edit ? "Edit transaction" : "New transaction"}
		</Type>

		<div className="transactionAmountContainer">

			<ButtonGroup
				size="small"
			>
				<Button
					size="small"
					color="primary"
					variant={props.sign === "+" ? "contained" : "outlined"}
					onClick={() => {
						props.onSignChange("+")
						amountInputRef.current?.focus()
					}}
				>
					{"+"}
				</Button>
				<Button
					size="small"
					color="primary"
					variant={props.sign === "-" ? "contained" : "outlined"}
					onClick={() => {
						props.onSignChange("-")
						amountInputRef.current?.focus()
					}}
				>
					{"-"}
				</Button>
			</ButtonGroup>

			<TextField
				value={props.amount}
				onChange={e => props.onAmountChange(e.target.value)}
				onKeyDown={e => {
					switch (e.key) {
						case "-":
							props.onSignChange("-")
							break;
						case "+":
							props.onSignChange("+")
							break;
					}
				}}
				id="transaction-amount"
				variant="outlined"
				name="amount"
				type="number"
				label="Amount"
				error={!!props.errors.amount}
				helperText={props.errors.amount}
				fullWidth
				required
				size="small"
				autoFocus={!props.edit}
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
			inputValue={props.category}
			onInputChange={(e, v) => {
				props.onCategoryChange(v)
			}}
			id="transaction-category"
			freeSolo
			openOnFocus
			autoHighlight
			selectOnFocus
			disableClearable
			fullWidth
			size="small"
			autoComplete
			options={props.categories.map(_ => _.value)}
			renderInput={(params) => (
				<TextField
					variant="outlined"
					name="category"
					type="text"
					label="Category"
					autoComplete="off"
					error={!!props.errors.category}
					helperText={props.errors.category}
					required
					{...params}
				/>
			)}
		/>

		<TextField
			value={props.comment}
			onChange={e => props.onCommentChange(e.target.value)}
			id="transaction-comment"
			variant="outlined"
			name="comment"
			type="text"
			label="Comment"
			error={!!props.errors.comment}
			helperText={props.errors.comment}
			fullWidth
			size="small"
		/>

		<KeyboardDatePicker
			value={props.time}
			onChange={d => props.onTimeChange(d as Date)}
			format="dd/MM/yyyy"
			id="transaction-time"
			variant={largerLayout ? "inline" : "dialog"}
			inputVariant="outlined"
			label="Date"
			error={!!props.errors.time}
			helperText={props.errors.time}
			fullWidth
			required
			size="small"
		/>

		<Button
			type="submit"
			color="primary"
			variant="contained"
			size="small"
		>
			{props.edit ? "Save" : "Create"}
		</Button>

	</form >
}