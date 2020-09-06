import React from 'react';
import { RegisterView } from './RegisterView';
import { InferType, object, string, ref } from "yup"
import { useStoreActions } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';

export const registerValidationSchema = object({
	email: string().defined().max(255).email(),
	password: string().defined().min(5).max(255),
	repeatPassword: string().defined().oneOf([ref("password")], "passwords must match")
}).defined()

export type RegisterFormType = InferType<typeof registerValidationSchema>

export const RegisterController: React.FC<{}> = () => {

	const redirect = useRedirect()

	const register = useStoreActions(_ => _.auth.registerWithEmailPassword)

	async function handleSubmit(values: RegisterFormType) {
		await register({ email: values.email, password: values.password })
	}

	async function handleLogin() {
		redirect(_ => _.login)
	}

	return <RegisterView
		handleSubmit={handleSubmit}
		handleLogin={handleLogin}
	/>
}