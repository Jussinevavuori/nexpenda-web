import { useEffect, useRef, useState } from "react"
import { TransactionFormProps } from "./TransactionForm"
import { useStoreActions, useStoreState } from "../../store"


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
	const [sign, setSign] = useState<"+" | "-">("-")
	const [amount, setAmount] = useState<string>("")
	const [category, setCategory] = useState<string>("")
	const [time, setTime] = useState<Date>(new Date())
	const [comment, setComment] = useState<string>("")

	/**
	 * Initialize input state from editTransaction. We use the
	 * `latestEditTransactionId` for preventing double-initializations of
	 * the same transaction.
	 */
	const latestEditTransactionId = useRef<string>('')
	useEffect(() => {
		if (!editTransaction) {
			return
		}
		if (latestEditTransactionId.current === editTransaction.id) {
			return
		}
		latestEditTransactionId.current = editTransaction.id
		setSign(editTransaction.amount.sign === 1 ? "+" : "-")
		setAmount(editTransaction.amount.decimalValue.toFixed(2))
		setCategory(editTransaction.category.value)
		setComment(editTransaction.comment)
		setTime(editTransaction.date)
	}, [editTransaction])

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

		/**
		 * Post or edit transaction
		 */
		const result = editTransaction
			? await putTransaction({
				id: editTransaction.id,
				integerAmount,
				category: category.trim(),
				time: time.getTime(),
				comment: comment.trim(),
			})
			: await postTransaction({
				integerAmount,
				category: category.trim(),
				time: time.getTime(),
				comment: comment.trim(),
			})

		/**
		 * Handle success by reseting form
		 */
		if (result.isSuccess()) {

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
			console.error(result)
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
		sign: sign,
		amount: amount,
		category: category,
		time: time,
		comment: comment,
		onSignChange: setSign,
		onAmountChange: setAmount,
		onCategoryChange: setCategory,
		onTimeChange: setTime,
		onCommentChange: setComment,
		errors: errors,
		categories: categories,
		edit: !!editTransaction,
	}
}