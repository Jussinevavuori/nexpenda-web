import React from 'react';
import { LoginView } from './LoginView';
import * as yup from "yup"
import { useStoreActions } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';

export const loginValidationSchema = yup.object({
	email: yup.string().defined().min(3).max(255).email(),
	password: yup.string().defined().min(3).max(255),
}).defined()

export type LoginFormType = yup.InferType<typeof loginValidationSchema>

export const LoginController: React.FC<{}> = () => {

	const redirect = useRedirect()

	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)
	const loginWithEmailPassword = useStoreActions(_ => _.auth.loginWithEmailPassword)

	async function handleSubmit(values: LoginFormType) {
		const error = await loginWithEmailPassword(values)
		console.log({ error })
		if (error) {
			console.error(error)
		} else {
			redirect(routes => routes.dashboard)
		}
	}

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	return <LoginView {...{ handleGoogleSubmit, handleSubmit }} />
}