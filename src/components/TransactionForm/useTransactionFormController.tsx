import ReactGA from "react-ga";
import emojiRegex from "emoji-regex"
import * as z from "zod"
import { useCallback, useEffect, useRef, useState } from "react"
import { TransactionFormProps } from "./TransactionForm"
import { useStoreActions, useStoreState } from "../../store"
import { Category } from "../../classes/Category";
import { useOnTransactionCopy } from "../../hooks/application/useOnTransactionCopy";
import { Transaction } from "../../classes/Transaction";
import { useCalculatorDialogOpenState } from "../../hooks/componentStates/useCalculatorDialogOpenState";
import { useOpenStateWrapper } from "../../hooks/state/useOpenStateWrapper";

export const transactionFormSchema = z.object({
	icon: z.string(),
	sign: z.enum(["+", "-"]),
	amount: z.string(),
	category: z.string(),
	time: z.date(),
	comment: z.string(),
})

export type TransactionFormSchema = z.TypeOf<typeof transactionFormSchema>

export function useTransactionFormController(props: TransactionFormProps) {

	const notify = useStoreActions(_ => _.notification.notify)

	const editTransaction = props.editTransaction

	const categories = useStoreState(_ => _.transactions.categories)

	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)
	const putTransaction = useStoreActions(_ => _.transactions.putTransaction)

	/**
	 * Loading state
	 */
	const [loading, setLoading] = useState(false)

	/**
	 * Input state
	 */
	const [icon, setIcon] = useState<string>("")
	const [sign, setSign] = useState<"+" | "-">("-")
	const [amount, setAmount] = useState<string>("")
	const [category, setCategory] = useState<string>("")
	const [time, setTime] = useState<Date>(new Date())
	const [comment, setComment] = useState<string>("")

	/**
	 * Emoji picker state
	 */
	const [emojiPickerAnchor, setEmojiPickerAnchor] = useState<Element | null>(null)
	const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

	/**
	 * Calculator state
	 */
	const {
		isOpen: isCalculatorOpen,
		handleOpen: handleCalculatorOpen,
		handleClose: handleCalculatorClose,
	} = useOpenStateWrapper(useCalculatorDialogOpenState())

	/**
	 * Calculator submission handler
	 */
	const onCalculatorSubmit = useCallback((value: number) => {
		handleCalculatorClose()
		if (!Number.isNaN(value)) {
			setSign(value <= 0 ? "-" : "+");
			setAmount(value.toFixed(2));
		}
	}, [handleCalculatorClose])

	// If existing category selected and it has an icon, display
	// it (unless an icon is selected)
	const existingCategoryIcon = categories.find(_ => _.value === category)?.icon

	// Initialize input state from editTransaction. We use the
	// `latestEditTransactionId` for preventing double-initializations of
	// the same transaction.
	//
	// If no edit transaction present, attempt to get values from storage
	// service's autofill
	const latestEditTransactionId = useRef<string>('')
	useEffect(() => {

		// Skip when not editing transaction
		if (!editTransaction) return

		// Skip duplicate initialization of same editable transaction
		if (latestEditTransactionId.current === editTransaction.id) return

		// Memorize ID as latest edit transaction ID 
		latestEditTransactionId.current = editTransaction.id

		// Initialize values
		setSign(editTransaction.amount.sign === 1 ? "+" : "-")
		setAmount(editTransaction.amount.decimalValue.toFixed(2))
		setCategory(editTransaction.category.value)
		setComment(editTransaction.comment)
		setTime(editTransaction.date)
		setIcon(editTransaction.category.icon)
	}, [editTransaction])

	// Enable copying transactions
	useOnTransactionCopy(
		useCallback((copied: Transaction) => {
			setAmount(copied.amount.decimalValue.toFixed(2))
			setSign(copied.amount.signSymbol)
			setCategory(copied.category.name)
			setComment(copied.comment)
		}, [setAmount, setSign, setCategory, setComment])
	)

	/**
	 * Render option with icon in list
	 */
	function optionRenderer(categoryValue: string) {
		const categoryObject = categories.find(_ => _.value === categoryValue)
		if (categoryObject) {
			return categoryObject.getFullLabel(sign)
		}
		const icon = sign === "+"
			? Category.defaultIncomeIcon
			: Category.defaultExpenseIcon
		return `${icon} ${categoryValue}`
	}

	/**
	 * Error state
	 */
	const [errors, setErrors] = useState<{
		main?: string;
		amount?: string;
		category?: string;
		time?: string;
		comment?: string;
	}>({})

	function validateIcon(): string | undefined {
		if (emojiRegex().test(icon)) {
			return icon
		} else {
			return undefined
		}
	}

	/**
	 * Validator for amount
	 */
	function validateAmount(): string | undefined {
		/* eslint-disable-next-line no-useless-escape */
		const valid = /^-?\d*[\.,]?\d{0,2}$/.test(amount.trim())
		if (!valid) return "Invalid number"
		return undefined
	}

	/**
	 * Validator for category
	 */
	function validateCategory(): string | undefined {
		const c = category.trim()
		if (c === "") return "Please enter a cetegory"
		return undefined
	}

	/**
	 * Validator for time
	 */
	function validateTime(): string | undefined {
		const valid = time.getTime() > 0 && !isNaN(time.getTime())
		if (!valid) return "Invalid date"
		return undefined
	}

	/**
	 * Validator for comment
	 */
	function validateComment(): string | undefined {
		return undefined
	}

	/**
	 * Full validation
	 */
	function validateForm(): boolean {
		const amountValidationError = validateAmount()
		const categoryValidationError = validateCategory()
		const timeValidationError = validateTime()
		const commentValidationError = validateComment()

		setErrors({
			amount: amountValidationError,
			category: categoryValidationError,
			time: timeValidationError,
			comment: commentValidationError,
		})

		if (
			!amountValidationError &&
			!categoryValidationError &&
			!timeValidationError &&
			!commentValidationError
		) {
			return true
		}

		return false
	}

	/**
	 * Handle form submission
	 */
	async function handleSubmit() {
		/**
		 * Validate form
		 */
		const formValid = validateForm()
		if (!formValid) return

		setLoading(true)

		/**
		 * Parsing
		 */
		const integerAmount = Math.round(
			Math.abs(
				100 * Number(
					amount.trim().replace(/,/g, ".")
				)
			) * (sign === "+" ? 1 : -1)
		)

		const json: JsonTransactionInitializer = {
			integerAmount,
			category: category.trim(),
			time: time.getTime(),
			comment: comment.trim(),
			categoryIcon: validateIcon(),
		}

		/**
		 * Post or edit transaction
		 */
		const result = editTransaction
			? await putTransaction({ id: editTransaction.id, ...json })
			: await postTransaction(json)

		/**
		 * Handle success by reseting form
		 */
		if (result.isSuccess()) {

			if (editTransaction) {
				ReactGA.event({
					action: "Edit Transaction",
					category: "Transactions",
					label: result.value.category.value,
					value: result.value.integerAmount / 100,
				})
			} else {
				ReactGA.event({
					action: "Create Transaction",
					category: "Transactions",
					label: result.value.category.value,
					value: result.value.integerAmount / 100,
				})
			}

			if (editTransaction) {
				notify({
					message: "Changes saved"
				})
			}

			setAmount("")
			setCategory("")
			setTime(new Date())
			setComment("")
			setErrors({})
			latestEditTransactionId.current = ""
			if (props.onClose) {
				props.onClose()
			}
			setLoading(false)
			return
		}

		/**
		 * Handle error messages
		 */
		setErrors(() => {
			if (result.reason === "invalidServerResponse") {
				return { main: "Invalid response received from server" }
			}
			switch (result.code) {
				case "request/invalid-request-data":
					const e = result.data?.errors ?? {}
					return {
						amount: typeof e.integerAmount === "string" ? e.integerAmount : undefined,
						comment: typeof e.comment === "string" ? e.comment : undefined,
						category: typeof e.category === "string" ? e.category : undefined,
						time: typeof e.time === "string" ? e.time : undefined,
						main: typeof e._root === "string" ? e._root
							: typeof e.id === "string" ? e.id
								: typeof e.uid === "string" ? e.uid : undefined
					}
				case "transaction/already-exists":
					return { main: "Could not post transaction due to overlapping IDs" }
				case "auth/unauthorized":
					return { main: "Cannot edit another user's transaction" }
				case "server/unavailable":
					return { main: "Could not react server. Try again later." }
				default:
					return { main: "Error posting transaction." }
			}
		})

		setLoading(false)
	}

	return {
		loading,
		onSubmit: handleSubmit,
		sign,
		amount,
		category,
		time,
		comment,
		icon,
		existingCategoryIcon,
		emojiPickerOpen,
		emojiPickerAnchor,
		setEmojiPickerOpen,
		setEmojiPickerAnchor,
		onIconChange: setIcon,
		onSignChange: setSign,
		onAmountChange: setAmount,
		onCategoryChange: setCategory,
		onTimeChange: setTime,
		onCommentChange: setComment,
		isCalculatorOpen,
		handleCalculatorOpen,
		handleCalculatorClose,
		onCalculatorSubmit,
		errors: errors,
		categories: categories,
		edit: !!editTransaction,
		optionRenderer,
	}
}