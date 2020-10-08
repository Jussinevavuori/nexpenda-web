import React, { useState, useEffect } from 'react';
import { LoginView } from './LoginView';
import * as yup from "yup"
import { useStoreActions, useStoreState } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';
import { FormProvider, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers';

export const loginValidationSchema = yup.object({
	email: yup.string().defined().email(),
	password: yup.string().defined(),
}).defined()

export type LoginFormType = yup.InferType<typeof loginValidationSchema>

export function Login() {

	const [error, setError] = useState<string>()

	const redirect = useRedirect()

	const form = useForm<LoginFormType>({
		resolver: yupResolver(loginValidationSchema),
	})

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

		const email = values.email

		const result = await loginWithEmailPassword(values)

		if (result.isSuccess()) {
			redirect(routes => routes.dashboard)
		} else {
			switch (result.reason) {
				case "invalidServerResponse":
					setError("Invalid response received from server.")
					break;
				case "network":
					console.log("Network error detected")
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
							const response = await requestConfirmationEmail({ email })
							if (response.isSuccess()) {
								console.log("Success:", response)
								setError("Confirm your email before logging in. We have sent you a new email confirmation link to your email address.")
							} else {
								setError("Confirm your email before logging in. We were unable to send you a new email confirmation link.")
							}
							break;
						case "server/unavailable":
							setError("Could not contact server. Try again later.")
							break;
						default:
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

	return <FormProvider {...form}>
		<LoginView
			handleGoogleSubmit={handleGoogleSubmit}
			handleSubmit={handleSubmit}
			handleForgotPassword={handleForgotPassword}
			handleCreateAccount={handleCreateAccount}
			error={error}
			form={form}
		/>
	</FormProvider>
}