import "./TransactionScheduleForm.scss";
import React from "react";
import cx from "classnames";
import { useTransactionScheduleFormController } from "./useTransactionScheduleFormController";
import { TransactionSchedule } from "../../lib/DataModels/TransactionSchedule";
import { Dialog, IconButton, TextField, Button, ButtonGroup, InputAdornment, Icon, Switch, Menu } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Calculator } from "../Calculator/Calculator";
import { ButtonTextFieldGroup } from "../ButtonTextFieldGroup/ButtonTextFieldGroup";
import { Type } from "../Type/Type";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useSmMedia } from "../../hooks/utils/useMedia";
import { ScheduleForm } from "../ScheduleForm/ScheduleForm";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { EnhancedButton } from "../EnhancedButton/EnhancedButton";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";
import EmojiPicker from "emoji-picker-react";

export type TransactionScheduleFormProps = {
	onClose?(): void;

	/**
	 * If this prop is provided, the editor will default to editing
	 * this transaction instead of creating a new transaction.
	 */
	editTransactionSchedule?: TransactionSchedule;
};

export function TransactionScheduleForm(props: TransactionScheduleFormProps) {
	const controller = useTransactionScheduleFormController(props)
	const largerLayout = useSmMedia()
	const isDarkTheme = useIsDarkTheme()

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
			className={cx("TransactionScheduleForm")}
			onSubmit={controller.handleFormSubmit}
		>
			<main>

				<div className="transactionTemplate">

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
							autoFocus={!controller.isEditing}
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

					<ErrorMessage>{controller.form.errors.amount}</ErrorMessage>

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

					<ErrorMessage>{controller.form.errors.category}</ErrorMessage>

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

					<ErrorMessage>{controller.form.errors.comment}</ErrorMessage>

					<ButtonTextFieldGroup className="timeInput">
						<KeyboardDatePicker
							value={controller.form.values.firstOccurrence}
							onChange={d => controller.form.set("firstOccurrence", d as Date)}
							onBlur={controller.form.fields.firstOccurrence.onBlur}
							format="dd/MM/yyyy"
							autoOk
							variant={largerLayout ? "inline" : "dialog"}
							inputVariant="outlined"
							label="Starts on"
							// minDate={new Date()}
							error={!!controller.form.errors.firstOccurrence}
							fullWidth
							required
							size="small"
							helperText=""
						/>
					</ButtonTextFieldGroup>

					<ErrorMessage>{controller.form.errors.firstOccurrence}</ErrorMessage>
				</div>

				<div className="scheduleForm">
					<ScheduleForm
						alwaysEnabled
						fromDate={controller.form.values.firstOccurrence}
						value={controller.form.values.schedule}
						onChange={(s) => controller.form.set("schedule", s)}
					/>
				</div>

			</main>

			<footer>

				{
					controller.isEditing &&
					<div className="updateAll">
						<Type className="switchContainer" color={isDarkTheme ? "gray-300" : "gray-800"}>
							{"Update all existing occurences"}
							<Switch
								className="switch"
								checked={controller.form.values.updateAllTransactions}
								onChange={(e) => controller.form.set("updateAllTransactions", e.target.checked)}
							/>
						</Type>
					</div>
				}


				<div className="actions">
					<EnhancedButton
						type="submit"
						color="primary"
						variant="contained"
						className="submit"
						fullWidth
						loading={controller.form.isSubmitting}
					>
						{controller.isEditing ? "Save" : "Create"}
					</EnhancedButton>
				</div>
			</footer>

		</form>
	</>
}