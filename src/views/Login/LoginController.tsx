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

	/**
	 * Handle submitting of form
	 */
	async function handleSubmit(values: LoginFormType) {
		setError(undefined)

		/**
		 * Attempt login
		 */
		const result = await loginWithEmailPassword(values)

		/**
		 *  On success redirect
		 */
		if (result.isSuccess()) {
			return redirect(routes => routes.dashboard)
		}

		console.error(result)

		/**
		 * On failure, first attempt to recover from email-not-confirmed error
		 * by sending another email confirmation link.
		 */
		if (result.reason === "network" && result.code === "auth/email-not-confirmed") {
			const confirmationEmailRequest = await requestConfirmationEmail({ email: values.email })
			if (confirmationEmailRequest.isSuccess()) {
				setError("Confirm your email before logging in. We have sent you a new email confirmation link to your email address.")
			} else {
				setError("Confirm your email before logging in. We were unable to send you a new email confirmation link.")
			}
		}

		/**
		 * Else display correct error message
		 */
		setError(() => {
			switch (result.reason) {
				case "invalidServerResponse":
					return "Invalid response received from server."
				case "network":
					switch (result.code) {
						case "request/invalid-request-data":
							return "Invalid email or password."
						case "auth/invalid-credentials":
							return "Wrong password or the user does not have a password."
						case "auth/user-not-found":
							return "No user exists with that email."
						case "server/unavailable":
							return "Could not contact server. Try again later."
						default:
							return "An error occured while logging in. Try again."
					}
				default:
					return "An unknown error occured. Try again later."
			}
		})
	}

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	async function handleForgotPassword() {
		redirect(routes => routes.forgotPassword)
	}

	async function handleCreateAccount() {
		redirect(routes => routes.register)
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