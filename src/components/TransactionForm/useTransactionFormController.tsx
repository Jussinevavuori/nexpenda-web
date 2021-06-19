import emojiRegex from "emoji-regex"
import * as z from "zod"
import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { TransactionFormProps } from "./TransactionForm"
import { useStoreActions, useStoreState } from "../../store"
import { Category } from "../../classes/Category";
import { useOnTransactionCopy } from "../../hooks/application/useOnTransactionCopy";
import { Transaction } from "../../classes/Transaction";
import { useCalculatorOpenState } from "../../hooks/componentStates/useCalculatorOpenState";
import { getErrorMessage } from "../../utils/ErrorMessage/getErrorMessage";
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useEmojiPickerOpenState } from "../../hooks/componentStates/useEmojiPickerOpenState";
import { useGetFormError } from "../../hooks/forms/useGetFormError"

export const transactionFormSchema = z.object({
	icon: z.string().refine(str => !str.trim() || emojiRegex().test(str.trim()), "Invalid icon"),
	sign: z.enum(["+", "-"]),
	amount: z.string().regex(/^\+?-?\d*[.,]?\d{0,2}$/),
	category: z.string().transform(str => str.trim()),
	time: z.date().refine(d => !Number.isNaN(d.getTime()), "Invalid date"),
	comment: z.string().transform(str => str.trim()),
})

export type TransactionFormSchema = z.TypeOf<typeof transactionFormSchema>

export function useTransactionFormController(props: TransactionFormProps) {
	const editTransaction = props.editTransaction

	const categories = useStoreState(_ => _.transactions.categories)
	const notify = useStoreActions(_ => _.notification.notify)
	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)
	const putTransaction = useStoreActions(_ => _.transactions.putTransaction)

	/**
	 * Login form state
	 */
	const form = useForm<TransactionFormSchema>({
		resolver: zodResolver(transactionFormSchema),
		defaultValues: {
			sign: "-",
			time: new Date(),
			amount: "",
			category: "",
			comment: "",
			icon: "",
		}
	})

	const formValues = useWatch({ control: form.control })
	const getFormError = useGetFormError(form)
	const emojiPicker = useEmojiPickerOpenState()
	const calculator = useCalculatorOpenState()

	/**
	 * Calculator submission handler
	 */
	const onCalculatorSubmit = useCallback((value: number) => {
		calculator.handleClose()
		if (!Number.isNaN(value)) {
			form.setValue("sign", value <= 0 ? "-" : "+", { shouldValidate: true, shouldTouch: true });
			form.setValue("amount", value.toFixed(2), { shouldValidate: true, shouldTouch: true });
			form.trigger("amount")
			setTimeout(() => {
				document.getElementById("amountInput")?.focus()
			}, 10)
		}
	}, [calculator, form])

	/**
	 * Return an existing category if one found
	 */
	const existingCategory = useMemo(() => {
		return categories.find(_ => _.value === formValues.category)
	}, [formValues, categories])

	/**
	 * If editing, initialize the state from edit transaction. We use
	 * `latestEditTransactionId` for preventing double-initializations of
	 * the same transaction.
	 */
	const latestEditTransactionId = useRef<string>('')
	useEffect(() => {

		// Skip when not editing transaction
		if (!editTransaction) return

		// Skip duplicate initialization of same editable transaction
		if (latestEditTransactionId.current === editTransaction.id) return

		// Memorize ID as latest edit transaction ID 
		latestEditTransactionId.current = editTransaction.id

		// Initialize values
		form.setValue("sign", editTransaction.amount.sign === 1 ? "+" : "-")
		form.setValue("amount", editTransaction.amount.decimalValue.toFixed(2))
		form.setValue("category", editTransaction.category.value)
		form.setValue("comment", editTransaction.comment)
		form.setValue("time", editTransaction.date)
		form.setValue("icon", editTransaction.category.icon)
	}, [editTransaction, form])

	/**
	 * Enable copying transactions. When a copy is detected, automatically
	 * replace the values in the form.
	 */
	useOnTransactionCopy(
		useCallback((copied: Transaction) => {
			form.setValue("amount", copied.amount.decimalValue.toFixed(2))
			form.setValue("sign", copied.amount.signSymbol)
			form.setValue("category", copied.category.name)
			form.setValue("comment", copied.comment)
		}, [form])
	)

	/**
	 * Render option with icon in list
	 */
	function optionRenderer(categoryValue: string) {
		const categoryObject = categories.find(_ => _.value === categoryValue)
		if (categoryObject) {
			return categoryObject.getFullLabel(formValues.sign)
		}
		const icon = formValues.sign === "+"
			? Category.defaultIncomeIcon
			: Category.defaultExpenseIcon
		return `${icon} ${categoryValue}`
	}

	/**
	 * Submit error
	 */
	const [submitError, setSubmitError] = useState("")

	/**
	 * Form submission
	 */
	const handleFormSubmit = form.handleSubmit(async (values) => {

		// Parse integer amount
		const integerAmount = parseInputToIntegerAmount(values.amount, values.sign)

		// Values into format to post to server
		const json: JsonTransactionInitializer = {
			integerAmount,
			category: values.category,
			time: values.time.getTime(),
			comment: values.comment,
			categoryIcon: values.icon,
		}

		// Send create or edit transaction request
		const result = editTransaction
			? await putTransaction({ id: editTransaction.id, ...json })
			: await postTransaction(json)

		// In case of success, notify on edit and reset form
		if (result.isSuccess()) {
			if (editTransaction) {
				notify({ message: "Changes saved", severity: "success" })
			}

			form.reset()
			latestEditTransactionId.current = ""
			props.onClose?.()
		} else {

			// Handle error messages
			if (result.reason === "network" && result.code === "request/invalid-request-data") {
				const getError = (field: string) => {
					const e = result.data?.errors ?? {};
					return typeof e[field] && e[field] === "string" ? e[field] : undefined
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
					setSubmitError(getError("_root"))
				};
			} else {
				setSubmitError(getErrorMessage("transactionForm", result))
			}
		}
	}, () => {
		// On invalid values
		setSubmitError("Invalid values")
	})

	return {
		form,
		formValues,
		getFormError,
		handleFormSubmit,
		submitError,
		existingCategory,
		emojiPicker,
		calculator,
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