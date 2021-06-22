import "./TransactionForm.scss";
import React from "react"
import cx from "classnames"
import EmojiPicker from "emoji-picker-react";
import {
	TextField,
	InputAdornment,
	Button,
	ButtonGroup,
	Menu,
	IconButton,
	Dialog,
	Icon,
	DialogActions
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { Type } from "../Type/Type";
import { useMdMedia, useSmMedia } from "../../hooks/utils/useMedia";
import { Transaction } from "../../lib/DataModels/Transaction";
import { useTransactionFormController } from "./useTransactionFormController";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { Close, Replay } from "@material-ui/icons";
import { Calculator } from "../Calculator/Calculator";
import { ButtonTextFieldGroup } from "../ButtonTextFieldGroup/ButtonTextFieldGroup";
import { ScheduleForm } from "../ScheduleForm/ScheduleForm";

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
	const controller = useTransactionFormController(props)
	const largerLayout = useSmMedia()
	const isDesktopLayout = useMdMedia()

	return <>

		{/* Emoji menu */}
		<Menu
			anchorEl={controller.emojiPicker.anchorEl}
			open={controller.emojiPicker.isOpen}
			onClose={controller.emojiPicker.handleClose}
		>
			<div>
				<EmojiPicker
					native
					disableAutoFocus
					onEmojiClick={(e, emoji) => {
						controller.form.set("icon", emoji.emoji)
						controller.emojiPicker.handleClose()
					}}
				/>
			</div>
		</Menu>

		{/* Schedule form dialog */}
		<Dialog
			open={controller.scheduleForm.isOpen}
			onClose={controller.scheduleForm.handleClose}
			maxWidth="sm"
			fullWidth
		>
			<div className="TransactionForm__ScheduleFormDialog">
				<Type>
					{"Set up a transaction schedule"}
				</Type>
				<ScheduleForm
					fromDate={controller.form.values.time}
					value={controller.form.values.schedule}
					onChange={s => controller.form.set("schedule", s)}
				/>
			</div>
			<DialogActions>
				<Button onClick={controller.scheduleForm.handleClose}>
					{"Ok"}
				</Button>
			</DialogActions>
		</Dialog>

		{/* Calculator dialog */}
		<Dialog
			open={controller.calculator.isOpen}
			onClose={controller.calculator.handleClose}
		>
			<div className="TransactionForm__CalculatorDialog">
				<Calculator
					initialValue={parseFloat(controller.form.values.amount ?? "")}
					onSubmit={controller.onCalculatorSubmit}
				/>
				<IconButton onClick={controller.calculator.handleClose}>
					<Close />
				</IconButton>
			</div>
		</Dialog>

		<form
			className={cx(`TransactionForm`, props.variant || "vertical", {
				titleHidden: !!props.hideTitle,
				hasCloseButton: !!props.showCloseButton
			})}
			onSubmit={controller.handleFormSubmit}
		>

			{
				props.hideTitle ? null : <div className="title">
					<Type
						component="p"
						variant="boldcaps"
						color="gray-600"
					>
						{controller.isEditingTransaction ? "Edit transaction" : "New transaction"}
					</Type>
				</div>
			}

			<ButtonTextFieldGroup className="amountInput">
				<ButtonGroup>
					<Button
						color={controller.form.values.sign === "+" ? "primary" : undefined}
						variant={controller.form.values.sign === "+" ? "contained" : "outlined"}
						onClick={() => {
							controller.form.set("sign", "+")
							document.getElementById("amountInput")?.focus()
						}}
					>
						{"+"}
					</Button>
					<Button
						color={controller.form.values.sign === "-" ? "primary" : undefined}
						variant={controller.form.values.sign === "-" ? "contained" : "outlined"}
						onClick={() => {
							controller.form.set("sign", "-")
							document.getElementById("amountInput")?.focus()
						}}
					>
						{"-"}
					</Button>
				</ButtonGroup>

				<TextField
					value={controller.form.values.amount}
					onChange={e => controller.form.set("amount", e.target.value)}
					onBlur={controller.form.fields.amount.onBlur}
					onKeyDown={e => {
						if (e.key === "-" || e.key === "+")
							controller.form.set("sign", e.key)
					}}
					variant="outlined"
					type="number"
					label="Amount"
					fullWidth
					required
					size="small"
					autoFocus={!controller.isEditingTransaction}
					autoComplete="off"
					error={!!controller.form.errors.amount}
					inputProps={{ id: "amountInput" }}
					InputProps={{
						endAdornment: <InputAdornment className="amountEndAdornment" position="end">
							<Type>
								{"EUR"}
							</Type>
						</InputAdornment>
					}}
				/>
				<ButtonGroup>
					<Button
						variant="outlined"
						onClick={() => controller.calculator.handleOpen()}
					>
						<Icon color="primary">{"calculate"}</Icon>
					</Button>
				</ButtonGroup>
			</ButtonTextFieldGroup>

			<ButtonTextFieldGroup className="categoryInput">
				<ButtonGroup>
					<Button
						tabIndex={-1}
						variant="outlined"
						onClick={e => controller.emojiPicker.handleOpen(e)}
					>
						{
							controller.form.values.icon
							|| controller.existingCategory?.icon
							|| (controller.form.values.sign === "+" ? "💰" : "💸")
						}
					</Button>
				</ButtonGroup>
				<Autocomplete
					inputValue={controller.form.values.category}
					onInputChange={(e, v) => controller.form.set("category", v)}
					onBlur={controller.form.fields.category.onBlur}
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
							onBlur={controller.form.fields.category.onBlur}
							variant="outlined"
							type="text"
							label="Category"
							autoComplete="off"
							error={!!controller.form.errors.category}
							required
							{...params}
						/>
					)}
				/>
			</ButtonTextFieldGroup>

			<TextField
				value={controller.form.values.comment}
				onChange={e => controller.form.set("comment", e.target.value)}
				onBlur={controller.form.fields.comment.onBlur}
				error={!!controller.form.errors.comment}
				className="commentInput"
				variant="outlined"
				type="text"
				label="Comment"
				fullWidth
				size="small"
			/>

			<ButtonTextFieldGroup className="timeInput">
				<KeyboardDatePicker
					value={controller.form.values.time}
					onChange={d => controller.form.set("time", d as Date)}
					onBlur={controller.form.fields.time.onBlur}
					format="dd/MM/yyyy"
					autoOk
					variant={largerLayout ? "inline" : "dialog"}
					inputVariant="outlined"
					label="Date"
					error={!!controller.form.errors.time}
					fullWidth
					helperText=""
					required
					size="small"
				/>
				{
					!controller.isEditingTransaction &&
					<ButtonGroup>
						<Button
							variant="outlined"
							onClick={controller.scheduleForm.handleOpen}
							color={controller.form.values.schedule.enabled ? "primary" : undefined}
						>
							<Replay
							/>
						</Button>
					</ButtonGroup>
				}
			</ButtonTextFieldGroup>


			<EnhancedButton
				type="submit"
				color="primary"
				variant="contained"
				className="submit"
				fullWidth
				loading={controller.form.isSubmitting}
			>
				{controller.isEditingTransaction ? "Save" : "Create"}
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
	</>
}