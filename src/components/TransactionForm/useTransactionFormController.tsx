import emojiRegex from "emoji-regex"
import * as z from "zod"
import { useCallback, useEffect, useRef, useMemo } from "react"
import { TransactionFormProps } from "./TransactionForm"
import { useStoreActions, useStoreState } from "../../store"
import { Category } from "../../lib/DataModels/Category";
import { useOnTransactionCopy } from "../../hooks/application/useOnTransactionCopy";
import { Transaction } from "../../lib/DataModels/Transaction";
import { useCalculatorOpenState } from "../../hooks/componentStates/useCalculatorOpenState";
import { getErrorMessage } from "../../lib/ErrorMessages/getErrorMessage";
import { useEmojiPickerOpenState } from "../../hooks/componentStates/useEmojiPickerOpenState";
import { useControlledForm } from "../../hooks/forms/useControlledForm"
import { useControlledFormField } from "../../hooks/forms/useControlledFormField"
import { useScheduleFormOpenState } from "../../hooks/componentStates/useScheduleFormOpenState"
import { defaultScheduleFormField, scheduleFormFieldSchema } from "../../lib/Forms/scheduleFormField"

export const transactionFormSchema = z.object({
	icon: z.string().refine(str => !str.trim() || emojiRegex().test(str.trim()), "Invalid icon"),
	sign: z.enum(["+", "-"]),
	amount: z.string().regex(/^\+?-?\d*[.,]?\d{0,2}$/),
	category: z.string().refine(str => !!str.trim()),
	time: z.date().refine(d => !Number.isNaN(d.getTime()), "Invalid date"),
	comment: z.string(),
	schedule: scheduleFormFieldSchema,
})

export type TransactionFormSchema = z.TypeOf<typeof transactionFormSchema>

export function useTransactionFormController(props: TransactionFormProps) {
	const editTransaction = props.editTransaction

	const categories = useStoreState(_ => _.transactions.categories)
	const notify = useStoreActions(_ => _.notification.notify)
	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)
	const putTransaction = useStoreActions(_ => _.transactions.putTransaction)
	const postSchedule = useStoreActions(_ => _.schedules.postSchedule)

	/**
	 * Form state
	 */
	const form = useControlledForm<TransactionFormSchema>({
		fields: {
			icon: useControlledFormField({
				defaultValue: "",
				validation: transactionFormSchema.shape.icon,
			}),
			sign: useControlledFormField({
				defaultValue: "-",
				validation: transactionFormSchema.shape.sign,
			}),
			amount: useControlledFormField({
				defaultValue: "",
				validation: transactionFormSchema.shape.amount,
			}),
			category: useControlledFormField({
				defaultValue: "",
				validation: transactionFormSchema.shape.category,
			}),
			time: useControlledFormField({
				defaultValue: new Date(),
				validation: transactionFormSchema.shape.time,
			}),
			comment: useControlledFormField({
				defaultValue: "",
				validation: transactionFormSchema.shape.comment,
			}),
			schedule: useControlledFormField({
				defaultValue: defaultScheduleFormField,
				validation: transactionFormSchema.shape.schedule,
			})
		}
	})

	/**
	 * Open states
	 */
	const emojiPicker = useEmojiPickerOpenState()
	const calculator = useCalculatorOpenState()
	const scheduleForm = useScheduleFormOpenState()

	/**
	 * Calculator submission handler
	 */
	const onCalculatorSubmit = useCallback((value: number) => {
		calculator.handleClose()
		if (!Number.isNaN(value)) {
			form.set("sign", value <= 0 ? "-" : "+");
			form.set("amount", value.toFixed(2));
			setTimeout(() => { document.getElementById("amountInput")?.focus() }, 10)
		}
	}, [calculator, form])

	/**
	 * Return an existing category if one found
	 */
	const existingCategory = useMemo(() => {
		return categories.find(_ => _.value === form.values.category)
	}, [form, categories])

	/**
	 * If editing, initialize the state from edit transaction. We use
	 * `latestEditId` for preventing double-initializations of
	 * the same transaction.
	 */
	const latestEditId = useRef<string>('')
	useEffect(() => {

		// Skip when not editing transaction
		if (!editTransaction) return

		// Skip duplicate initialization of same editable transaction
		if (latestEditId.current === editTransaction.id) return

		// Memorize ID as latest edit transaction ID 
		latestEditId.current = editTransaction.id

		// Initialize values
		form.set("sign", editTransaction.amount.sign === 1 ? "+" : "-")
		form.set("amount", editTransaction.amount.decimalValue.toFixed(2))
		form.set("category", editTransaction.category.value)
		form.set("comment", editTransaction.comment)
		form.set("time", editTransaction.date)
	}, [editTransaction, form])

	/**
	 * Enable copying transactions. When a copy is detected, automatically
	 * replace the values in the form.
	 */
	useOnTransactionCopy(
		useCallback((copied: Transaction) => {
			form.set("amount", copied.amount.decimalValue.toFixed(2))
			form.set("sign", copied.amount.signSymbol)
			form.set("category", copied.category.name)
			form.set("comment", copied.comment)
		}, [form])
	)

	/**
	 * Render option with icon in list
	 */
	function optionRenderer(categoryValue: string) {
		const categoryObject = categories.find(_ => _.value === categoryValue)
		if (categoryObject) {
			return categoryObject.getFullLabel(form.values.sign)
		}
		const icon = form.values.sign === "+"
			? Category.defaultIncomeIcon
			: Category.defaultExpenseIcon
		return `${icon} ${categoryValue}`
	}

	/**
	 * Remove all emojis from category string. Use emojis as icon instead.
	 */
	const _categoryValue = form.values.category
	useEffect(() => {
		const regex = emojiRegex()

		// Use first emoji as new icon if one introduced
		const emojis = _categoryValue.match(regex)
		if (emojis && emojis.length > 0) form.set("icon", emojis[0])

		// Replace emojis from category
		const categoryWithoutEmojis = _categoryValue.replace(regex, "")
		if (_categoryValue !== categoryWithoutEmojis) {
			form.set("category", categoryWithoutEmojis)
		}
	}, [form, _categoryValue])

	/**
	 * Form submission
	 */
	const handleFormSubmit = form.createSubmitHandler(async (formresult) => {

		if (!formresult.isValid) {
			form.setSubmitError("Invalid values.")
			notify({ message: "Could not create transaction", severity: "error" })
			return false;
		}

		// Parse values and put into format for posting to server
		const values = formresult.values
		const integerAmount = parseInputToIntegerAmount(values.amount, values.sign)
		const json: JsonTransactionInitializer = {
			integerAmount,
			category: values.category.trim(),
			time: values.time.getTime(),
			comment: values.comment.trim(),
			categoryIcon: values.icon,
		}

		// Send create or edit transaction request
		const result = editTransaction
			? await putTransaction({ id: editTransaction.id, ...json })
			: await postTransaction(json)

		// If a schedule is defined, post it
		if (result.isSuccess() && !editTransaction && values.schedule.enabled) {
			await postSchedule({
				schedule: {
					firstOccurrence: values.time.getTime(),
					occurrences: values.schedule.occurrencesEnabled ? values.schedule.occurrences : undefined,
					interval: {
						every: values.schedule.every,
						type: values.schedule.type,
					}
				},
				transactionTemplate: {
					integerAmount,
					category: values.category.trim(),
					comment: values.comment.trim(),
				},
				assignTransactions: [result.value.id],
			})
		}

		// In case of success, notify on edit and reset form
		if (result.isSuccess()) {
			if (editTransaction) {
				notify({ message: "Changes saved", severity: "success" })
			}

			form.reset()
			latestEditId.current = ""
			props.onClose?.()
			return true;
		} else {

			// Handle error messages
			if (result.reason === "network" && result.code === "request/invalid-request-data") {
				const getError = (field: string) => {
					const e = result.data?.errors ?? {};
					const f = e[field]
					return f && typeof f === "string" ? f : undefined
				}
				const attemptSetError = (field: keyof TransactionFormSchema) => {
					const msg = getError(field)
					if (msg) form.setError(field, msg)
				}
				attemptSetError("amount")
				attemptSetError("comment")
				attemptSetError("category")
				attemptSetError("time")
				if (getError("_root")) {
					form.setSubmitError(getError("_root"))
				};
			} else {
				form.setSubmitError(getErrorMessage("transactionForm", result))
			}
			return false;
		}
	})

	return {
		form,
		handleFormSubmit,
		existingCategory,
		emojiPicker,
		calculator,
		scheduleForm,
		onCalculatorSubmit,
		categories,
		isEditingTransaction: !!editTransaction,
		optionRenderer,
	}
}

/**
 * Parses a numeric input to an integer amount.
 */
function parseInputToIntegerAmount(amount: string, signStr: "+" | "-"): number {
	const parsedString = amount.trim().replace(/,/g, ".")
	const parsedNumber = 100 * parseFloat(parsedString)
	const parsedInteger = Math.round(Math.abs(parsedNumber))
	const sign = (signStr === "+" ? 1 : -1)
	return parsedInteger * sign
}