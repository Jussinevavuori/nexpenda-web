import "./TransactionForm.scss";
import React, { useRef } from "react"
import cx from "classnames"
import EmojiPicker from "emoji-picker-react";
import { TextField, InputAdornment, Button, ButtonGroup, Menu, IconButton } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { Type } from "../Type/Type";
import { useMdMedia, useSmMedia } from "../../hooks/utils/useMedia";
import { Transaction } from "../../classes/Transaction";
import { useTransactionFormController } from "./useTransactionFormController";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { Close } from "@material-ui/icons";

export type TransactionFormProps = {
	onClose?(): void;

	/**
	 * If this prop is provided, the editor will default to editing
	 * this transaction instead of creating a new transaction.
	 */
	editTransaction?: Transaction;

	variant?: "vertical" | "horizontal";

	hideTitle?: boolean;

	showCloseButton?: boolean;

}

export function TransactionForm(props: TransactionFormProps) {

	const amountInputRef = useRef<HTMLDivElement | null>(null)

	const controller = useTransactionFormController(props)

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		controller.onSubmit()
	}

	const largerLayout = useSmMedia()
	const isDesktopLayout = useMdMedia()

	return <form
		className={cx(`TransactionForm`, props.variant || "vertical", {
			titleHidden: !!props.hideTitle,
			hasCloseButton: !!props.showCloseButton
		})}
		onSubmit={handleSubmit}
	>

		{
			props.hideTitle ? null : <div className="title">
				<Type
					component="p"
					variant="boldcaps"
					color="gray-600"
				>
					{controller.edit ? "Edit transaction" : "New transaction"}
				</Type>
			</div>
		}


		<div className="buttonTextFieldGroup transaction-amount">
			<ButtonGroup>
				<Button
					color={controller.sign === "+" ? "primary" : undefined}
					variant={controller.sign === "+" ? "contained" : "outlined"}
					onClick={() => {
						controller.onSignChange("+")
						const amountInput = amountInputRef.current
						if (amountInput) {
							amountInput.focus()
						}
					}}
				>
					{"+"}
				</Button>
				<Button
					color={controller.sign === "-" ? "primary" : undefined}
					variant={controller.sign === "-" ? "contained" : "outlined"}
					onClick={() => {
						controller.onSignChange("-")
						const amountInput = amountInputRef.current
						if (amountInput) {
							amountInput.focus()
						}
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

		<Menu
			anchorEl={controller.emojiPickerAnchor}
			open={controller.emojiPickerOpen}
			onClose={() => controller.setEmojiPickerOpen(false)}
		>
			<div>
				<EmojiPicker
					native
					disableAutoFocus
					onEmojiClick={(e, emoji) => {
						controller.setEmojiPickerAnchor(null)
						controller.setEmojiPickerOpen(false)
						controller.onIconChange(emoji.emoji)
					}}
				/>
			</div>
		</Menu>

		<div className="buttonTextFieldGroup transaction-category">
			<ButtonGroup>
				<Button
					tabIndex={-1}
					className="transaction-emoji"
					variant="outlined"
					onClick={(e) => {
						controller.setEmojiPickerAnchor(e.currentTarget)
						controller.setEmojiPickerOpen(true)
					}}
				>
					{
						controller.icon
						|| controller.existingCategoryIcon
						|| (controller.sign === "+" ? "💰" : "💸")
					}
				</Button>
			</ButtonGroup>
			<Autocomplete
				inputValue={controller.category}
				onInputChange={(e, v) => controller.onCategoryChange(v)}
				id="transaction-category"
				freeSolo
				openOnFocus
				autoHighlight
				selectOnFocus
				disableClearable
				size="small"
				autoComplete
				fullWidth
				options={controller.categories.map(_ => _.value)}
				renderOption={controller.optionRenderer}
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
		</div>

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
			autoOk
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
			fullWidth
			loading={controller.loading}
		>
			{controller.edit ? "Save" : "Create"}
		</EnhancedButton>

		{
			props.showCloseButton && (
				isDesktopLayout
					? <Button
						variant="outlined"
						className="close"
						onClick={() => { if (props.onClose) { props.onClose() } }}
					>
						<Close />
					</Button>
					: <IconButton
						className="close"
						onClick={() => { if (props.onClose) { props.onClose() } }}
					>
						<Close />
					</IconButton>
			)
		}

	</form >
}