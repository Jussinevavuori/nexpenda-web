import React, { useState } from "react"
import { TransactionFormView } from "./TransactionFormView"
import { useStoreActions, useStoreState } from "../../store"

export type TransactionFormProps = {

}

export function TransactionForm(props: TransactionFormProps) {

	const categories = useStoreState(_ => _.transactions.categories)

	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)

	/**
	 * Input state
	 */
	const [amount, setAmount] = useState<string>("")
	const [category, setCategory] = useState<string>("")
	const [time, setTime] = useState<Date>(new Date())
	const [comment, setComment] = useState<string>("")

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

		/**
		 * Post transaction
		 */
		const result = await postTransaction({
			integerAmount: Math.trunc(Number(amount.trim().replace(/,/g, '.')) * 100),
			category: category.trim(),
			time: time.getTime(),
			comment: comment.trim(),
		})

		/**
		 * Handle success by reseting form
		 */
		if (result.isSuccess()) {
			setAmount("")
			setCategory("")
			setTime(new Date())
			setComment("")
			setErrors({})
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
				case "server/unavailable":
					return { main: "Could not react server. Try again later." }
				default:
					return { main: "Error posting transaction." }
			}
		})
	}

	return <TransactionFormView
		onSubmit={handleSubmit}
		amount={amount}
		category={category}
		time={time}
		comment={comment}
		onAmountChange={value => setAmount(value)}
		onCategoryChange={value => setCategory(value)}
		onTimeChange={value => setTime(value)}
		onCommentChange={value => setComment(value)}
		errors={errors}
		categories={categories}
	/>
}