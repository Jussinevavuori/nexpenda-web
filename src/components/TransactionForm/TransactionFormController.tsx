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
	const [error, setError] = useState<string>()
	const [amountError, setAmountError] = useState<string>()
	const [categoryError, setCategoryError] = useState<string>()
	const [timeError, setTimeError] = useState<string>()
	const [commentError, setCommentError] = useState<string>()

	/**
	 * Validators
	 */
	function validateAmount(): string | undefined {
		/* eslint-disable-next-line no-useless-escape */
		const valid = /^-?\d*[\.,]?\d{0,2}$/.test(amount.trim())
		if (!valid) return "Invalid number"
		return undefined
	}

	function validateCategory(): string | undefined {
		const valid = /[A-Za-z\d\-_\s]+/.test(category.trim())
		const empty = category.trim() === ""
		if (!valid) return "Invalid category, do not use any special characters"
		if (empty) return "Please enter a cetegory"
		return undefined
	}

	function validateTime(): string | undefined {
		const valid = time.getTime() > 0 && !isNaN(time.getTime())
		if (!valid) return "Invalid date"
		return undefined
	}

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

		setAmountError(amountValidationError)
		setCategoryError(categoryValidationError)
		setTimeError(timeValidationError)
		setCommentError(commentValidationError)

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
		const formValid = validateForm()
		if (formValid) {
			const result = await postTransaction({
				integerAmount: Math.trunc(Number(amount.trim().replace(/,/g, '.')) * 100),
				category: category.trim(),
				time: time.getTime(),
				comment: comment.trim(),
			})
			result.onSuccess(() => {
				setAmount("")
				setCategory("")
				setTime(new Date())
				setComment("")
			})
			result.onFailure(failure => {
				switch (failure.code) {
					case "data/invalid-request-data":
						if (failure.data?.errors?.integerAmount) {
							setAmountError(String(failure.data.errors.integerAmount))
						}
						if (failure.data?.errors?.category) {
							setCategoryError(String(failure.data.errors.category))
						}
						if (failure.data?.errors?.comment) {
							setCommentError(String(failure.data.errors.comment))
						}
						if (failure.data?.errors?.time) {
							setTimeError(String(failure.data.errors.time))
						}
						if (failure.data?.errors?._root) {
							setError(failure.data.errors._root)
						}
						if (failure.data?.errors?.id) {
							setError(failure.data.errors.id)
						}
						if (failure.data?.errors?.uid) {
							setError(failure.data.errors.uid)
						}
						break;
					case "transaction/already-exists":
						setError("Could not post transaction due to overlapping IDs")
						break;
					case "server/unavailable":
						setError("Could not react server. Try again later.")
						break;
					default:
						console.warn("Uncaught failure", failure)
						setError("Error posting transaction.")
						break;
				}
			})
		}
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
		errors={{
			main: error,
			amount: amountError,
			category: categoryError,
			time: timeError,
			comment: commentError,
		}}
		categories={categories}
	/>
}