import React from "react";
import { useStoreState, useStoreActions } from "../../store";
import { useForm } from "react-hook-form";
import { object, string, ObjectSchema, number } from "yup"
import { yupResolver } from "@hookform/resolvers";

export type HomeScreenViewProps = {}

type TransactionFormType = {
	comment?: string;
	category: string;
	integerAmount: number;
}

const transactionFormSchema: ObjectSchema<TransactionFormType> = object({
	comment: string(),
	category: string().required(),
	integerAmount: number().required().integer()
}).required()

export default function HomeScreenView(props: HomeScreenViewProps) {

	const { register, handleSubmit, errors, formState } = useForm<TransactionFormType>({
		resolver: yupResolver(transactionFormSchema),
	})

	const integerAmountError = formState.touched.integerAmount && errors.integerAmount?.message
	const categoryError = formState.touched.category && errors.category?.message
	const commentError = formState.touched.comment && errors.comment?.message

	const user = useStoreState(_ => _.auth.user)
	const transactions = useStoreState(_ => _.transactions.items)
	const postTransaction = useStoreActions(_ => _.transactions.postTransaction)

	if (!user) return null

	return <div >

		<header >

			<h1 >
				{`Welcome back, ${user.displayName}`}
			</h1>

		</header>

		<section>

			<h1>
				{`New transaction`}
			</h1>

			<form onSubmit={handleSubmit(values => {
				postTransaction({ ...values, time: Date.now() })
			})}>

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

			<h1>
				{`Your transactions this month`}
			</h1>

			<ul>
				{transactions.map(item => {
					return <li key={item.id}>
						<span>{item.date.toLocaleString()}</span>
						<span style={{ margin: "0 8px", fontWeight: "bold" }}>{item.formatFull}</span>
						<span>{item.category}</span>
						<span style={{ margin: "0 8px", fontStyle: "italic", opacity: 0.5, }}>{item.comment}</span>
					</li>
				})}
			</ul>

		</section>

	</div>

}