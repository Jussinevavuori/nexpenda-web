import React from 'react';
import { RegisterView } from './RegisterView';
import * as yup from "yup"

export const registerValidationSchema = yup.object({
	email: yup.string().defined().min(3).max(255).email(),
	password: yup.string().defined().min(3).max(255),
	repeatPassword: yup.string().defined().oneOf([yup.ref("password")], "passwords must match")
}).defined()

export type RegisterFormType = yup.InferType<typeof registerValidationSchema>

export const RegisterController: React.FC<{}> = () => {

	async function handleSubmit(values: RegisterFormType) {
		console.log("Submitted")
	}

	return <RegisterView handleSubmit={handleSubmit} />
}