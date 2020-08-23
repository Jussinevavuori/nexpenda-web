import styles from "./TransactionFormModalView.module.css";
import React from "react"
import { yupResolver } from "@hookform/resolvers";
import { TransactionForm, transactionFormSchema } from "./TransactionFormModalController";
import { useForm } from "react-hook-form";
import { Modal } from "../Modal/Modal";

export type TransactionFormModalViewProps = {
	open: boolean;
	handleClose: Function;
	handleSubmit(values: TransactionForm): void;
}

export function TransactionFormModalView(props: TransactionFormModalViewProps) {

	const { register, handleSubmit, errors, formState } = useForm<TransactionForm>({
		resolver: yupResolver(transactionFormSchema),
	})

	const integerAmountError = formState.touched.integerAmount && errors.integerAmount?.message
	const categoryError = formState.touched.category && errors.category?.message
	const commentError = formState.touched.comment && errors.comment?.message

	return <Modal open={props.open} onClose={props.handleClose}>
		<div className={styles.root}>
			<form onSubmit={handleSubmit(props.handleSubmit)}>
				<p>Integer amount</p>
				<input type="number" id="integerAmount" name="integerAmount" ref={register} />
				<p style={{ color: "#FF6622" }}>{integerAmountError}</p>
				<p>Category</p>
				<input type="text" id="category" name="category" ref={register} />
				<p style={{ color: "#FF6622" }}>{categoryError}</p>
				<p>Comment</p>
				<input type="text" id="comment" name="comment" ref={register} />
				<p style={{ color: "#FF6622" }}>{commentError}</p>
				<button type="submit">submit</button>
			</form>
		</div>
	</Modal>
}