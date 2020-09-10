import React, { useState, useEffect } from 'react';
import { LoginView } from './LoginView';
import * as yup from "yup"
import { useStoreActions, useStoreState } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';

export const loginValidationSchema = yup.object({
	email: yup.string().defined().email(),
	password: yup.string().defined(),
}).defined()

export type LoginFormType = yup.InferType<typeof loginValidationSchema>

export const Login: React.FC<{}> = () => {

	const [error, setError] = useState<string>()

	const redirect = useRedirect()

	const user = useStoreState(_ => _.auth.user)

	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)
	const loginWithEmailPassword = useStoreActions(_ => _.auth.loginWithEmailPassword)

	/**
	 * Check initial login
	 */
	useEffect(() => {
		if (user) {
			redirect(routes => routes.dashboard)
		}
	}, [user, redirect])

	async function handleSubmit(values: LoginFormType) {
		setError(undefined)

		const result = await loginWithEmailPassword(values)
		result.onSuccess(() => redirect(routes => routes.dashboard))

		result.onFailure(failure => {
			switch (failure.code) {
				case "data/invalid-request-data":
					setError("Invalid email or password.")
					break;
				case "auth/invalid-credentials":
					setError("Wrong password or the user does not have a password.")
					break;
				case "auth/user-not-found":
					setError("No user exists with that email.")
					break;
				case "auth/email-not-confirmed":
					setError("Confirm your email before logging in.")
					break;
				case "server/unavailable":
					setError("Could not contact server. Try again later.")
					break;
				default:
					console.warn("Uncaught error code in login:", failure)
					setError("An error occured while logging in. Try again.")
					break;
			}
		})
	}

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	async function handleForgotPassword() {
		redirect(_ => _.forgotPassword)
	}

	async function handleCreateAccount() {
		redirect(_ => _.register)
	}

	return <LoginView {...{
		handleGoogleSubmit,
		handleSubmit,
		handleForgotPassword,
		handleCreateAccount,
		error,
	}} />
}