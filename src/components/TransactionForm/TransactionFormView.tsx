import "./TransactionForm.scss";
import React from "react"
import { TextField, InputAdornment, Button } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { Type } from "../Type/Type";

export type TransactionFormViewProps = {

	onSubmit(): Promise<void>;

	/**
	 * Form state
	 */
	amount: string;
	category: string;
	time: Date;
	comment: string;

	/**
	 * Form change handlers
	 */
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

	categories: string[];

}

export function TransactionFormView(props: TransactionFormViewProps) {

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		props.onSubmit()
	}

	return <form className="TransactionForm" onSubmit={handleSubmit}>

		<Type variant="button">
			{"New transaction"}
		</Type>

		<TextField
			value={props.amount}
			onChange={e => props.onAmountChange(e.target.value)}
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
			inputProps={{

			}}
			InputProps={{
				endAdornment: <InputAdornment position="end">
					<Type>
						{"EUR"}
					</Type>
				</InputAdornment>
			}}
		/>

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
			options={props.categories}
			renderInput={(params) => (
				<TextField
					variant="outlined"
					name="category"
					type="text"
					label="Category"
					error={!!props.errors.category}
					helperText={props.errors.category}
					required
					{...params}
				/>
			)}
		/>

		<KeyboardDatePicker
			value={props.time}
			onChange={d => props.onTimeChange(d as Date)}
			format="dd/MM/yyyy"
			id="transaction-time"
			variant="inline"
			inputVariant="outlined"
			label="Date"
			error={!!props.errors.time}
			helperText={props.errors.time}
			fullWidth
			required
			size="small"
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

		<Button
			type="submit"
			color="primary"
			variant="contained"
			size="small"
		>
			{"Create"}
		</Button>

	</form>
}