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
	const requestConfirmationEmail = useStoreActions(_ => _.auth.requestConfirmationEmail)

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
		if (result.isSuccess()) {
			redirect(routes => routes.dashboard)
		}

		if (result.isFailure()) {
			switch (result.reason) {
				case "invalidServerResponse":
					setError("Invalid response received from server.")
					break;
				case "network":
					switch (result.code) {
						case "request/invalid-request-data":
							setError("Invalid email or password.")
							break;
						case "auth/invalid-credentials":
							setError("Wrong password or the user does not have a password.")
							break;
						case "auth/user-not-found":
							setError("No user exists with that email.")
							break;
						case "auth/email-not-confirmed":
							if (user?.email) {
								const response = await requestConfirmationEmail({ email: user.email })
								if (response.isSuccess()) {
									setError("Confirm your email before logging in.")
								} else {
									setError("Confirm your email before logging in. We have sent you a new email confirmation link.")
									console.warn("Error while requesting confirmation email", response)
								}
							}
							break;
						case "server/unavailable":
							setError("Could not contact server. Try again later.")
							break;
						default:
							console.warn("Uncaught error code in login:", result)
							setError("An error occured while logging in. Try again.")
							break;
					}
			}
		}
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