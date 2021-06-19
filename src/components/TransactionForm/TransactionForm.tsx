import "./TransactionForm.scss";
import React, { useRef } from "react"
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
	Icon
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Autocomplete } from "@material-ui/lab";
import { Type } from "../Type/Type";
import { useMdMedia, useSmMedia } from "../../hooks/utils/useMedia";
import { Transaction } from "../../classes/Transaction";
import { useTransactionFormController } from "./useTransactionFormController";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { Close, Replay } from "@material-ui/icons";
import { Calculator } from "../Calculator/Calculator";
import { ButtonTextFieldGroup } from "../ButtonTextFieldGroup/ButtonTextFieldGroup";
import { wrapRegister } from "../../utils/FormUtils/wrapRegister";

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
						controller.form.setValue("icon", emoji.emoji, {
							shouldValidate: true,
						})
						controller.emojiPicker.handleClose()
					}}
				/>
			</div>
		</Menu>

		{/* Calculator dialog */}
		<Dialog
			open={controller.calculator.isOpen}
			onClose={controller.calculator.handleClose}
		>
			<div className="TransactionForm__CalculatorDialog">
				<Calculator
					initialValue={parseFloat(controller.formValues.amount ?? "")}
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
						color={controller.formValues.sign === "+" ? "primary" : undefined}
						variant={controller.formValues.sign === "+" ? "contained" : "outlined"}
						onClick={() => {
							controller.form.setValue("sign", "+")
							amountInputRef.current?.focus()
						}}
					>
						{"+"}
					</Button>
					<Button
						color={controller.formValues.sign === "-" ? "primary" : undefined}
						variant={controller.formValues.sign === "-" ? "contained" : "outlined"}
						onClick={() => {
							controller.form.setValue("sign", "-")
							amountInputRef.current?.focus()
						}}
					>
						{"-"}
					</Button>
				</ButtonGroup>

				<TextField
					{...wrapRegister(controller.form.register("amount"), "inputRef")}
					onKeyDown={e => {
						if (e.key === "-" || e.key === "+")
							controller.form.setValue("sign", e.key)
					}}
					variant="outlined"
					type="number"
					label="Amount"
					fullWidth
					required
					size="small"
					autoFocus={!controller.isEditingTransaction}
					autoComplete="off"
					error={!!controller.getFormError("amount")}
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
							controller.formValues.icon
							|| controller.existingCategory?.icon
							|| (controller.formValues.sign === "+" ? "💰" : "💸")
						}
					</Button>
				</ButtonGroup>
				<Autocomplete
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
							{...wrapRegister(controller.form.register("category"), "inputRef")}
							variant="outlined"
							type="text"
							label="Category"
							autoComplete="off"
							error={!!controller.getFormError("category")}
							required
							{...params}
						/>
					)}
				/>
			</ButtonTextFieldGroup>

			<TextField
				{...wrapRegister(controller.form.register("comment"), "inputRef")}
				error={!!controller.getFormError("comment")}
				className="commentInput"
				variant="outlined"
				type="text"
				label="Comment"
				fullWidth
				size="small"
			/>

			<ButtonTextFieldGroup className="timeInput">
				<KeyboardDatePicker
					value={controller.formValues.time}
					onChange={d => controller.form.setValue("time", d as Date, {
						shouldValidate: true,
						shouldTouch: true,
					})}
					format="dd/MM/yyyy"
					autoOk
					variant={largerLayout ? "inline" : "dialog"}
					inputVariant="outlined"
					label="Date"
					error={!!controller.getFormError("time")}
					fullWidth
					required
					size="small"
				/>
				{
					!controller.isEditingTransaction &&
					<ButtonGroup>
						<Button
							variant="outlined"
							onClick={(e) => { console.log("Here") }}
						>
							<Replay />
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
				loading={controller.form.formState.isSubmitting}
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