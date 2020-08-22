import React from 'react';
import { RegisterView } from './RegisterView';
import { InferType, object, string, ref } from "yup"
import { useStoreActions } from '../../store';

export const registerValidationSchema = object({
	email: string().defined().max(255).email(),
	password: string().defined().min(5).max(255),
	repeatPassword: string().defined().oneOf([ref("password")], "passwords must match")
}).defined()

export type RegisterFormType = InferType<typeof registerValidationSchema>

export const RegisterController: React.FC<{}> = () => {

	const register = useStoreActions(_ => _.auth.registerWithEmailPassword)

	async function handleSubmit(values: RegisterFormType) {
		await register({ email: values.email, password: values.password })
	}

	return <RegisterView handleSubmit={handleSubmit} />
}