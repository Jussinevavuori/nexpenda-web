import React, { useCallback } from "react"
import { TransactionFormModalView } from "./TransactionFormModalView"
import { ObjectSchema, object, string, number } from "yup"
import { useStoreState, useStoreActions } from "../../store"
import { useOnKeyPress } from "../../hooks/useOnKeyPress"

export type TransactionForm = {
	comment?: string;
	category: string;
	integerAmount: number;
}

export const transactionFormSchema: ObjectSchema<TransactionForm> = object({
	comment: string(),
	category: string().required(),
	integerAmount: number().required().integer()
}).required()

export type TransactionFormProps = {

}


export function TransactionFormModal(props: TransactionFormProps) {

	const open = useStoreState(_ => _.transactionForm.isOpen)
	const openForm = useStoreActions(_ => _.transactionForm.open)
	const closeForm = useStoreActions(_ => _.transactionForm.close)

	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)

	function handleClose() {
		closeForm()
	}

	function handleSubmit(values: TransactionForm) {
		postTransaction({ ...values, time: Date.now() })
	}

	const handleKeyPressOpen = useCallback(() => {
		openForm()
	}, [openForm])

	// CTRL space opens menu
	useOnKeyPress({ key: 32, shift: false, ctrl: true, alt: false }, handleKeyPressOpen)

	return <TransactionFormModalView
		open={open}
		handleClose={handleClose}
		handleSubmit={handleSubmit}
	/>
}