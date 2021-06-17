import ReactGA from "react-ga";
import * as z from "zod";
import { useState, useEffect, useCallback } from 'react';
import { useStoreActions, useStoreState } from '../../store';
import { useRedirect } from '../../hooks/utils/useRedirect';
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';

export const loginValidationSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export type LoginFormType = z.TypeOf<typeof loginValidationSchema>

export function useLoginController() {
	const redirect = useRedirect()

	const user = useStoreState(_ => _.auth.user)

	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)
	const loginWithEmailPassword = useStoreActions(_ => _.auth.loginWithEmailPassword)
	const requestConfirmationEmail = useStoreActions(_ => _.auth.requestConfirmationEmail)


	/**
	 * Submit error
	 */
	const [error, setError] = useState<string>()

	/**
	 * Login form state
	 */
	const form = useForm<LoginFormType>({
		resolver: zodResolver(loginValidationSchema),
	})

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
	async function submitHandler(values: LoginFormType) {
		setError(undefined)

		/**
		 * Attempt login
		 */
		const result = await loginWithEmailPassword(values)

		/**
		 *  On success redirect
		 */
		if (result.isSuccess()) {
			ReactGA.event({
				action: "Login",
				category: "User",
			})
			return redirect(routes => routes.dashboard)
		}

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
						case "request/too-many-requests":
							return "You are trying too fast! Try again later."
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

	const handleSubmit = form.handleSubmit(submitHandler)

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	async function handleForgotPassword() {
		redirect(routes => routes.resetPassword)
	}

	async function handleCreateAccount() {
		redirect(routes => routes.register)
	}

	/**
	 * Password visible state
	 */
	const [passwordVisible, setPasswordVisible] = useState(false)

	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisible(value => !value)
	}, [setPasswordVisible])

	/**
	 * Email and password error shorthands for react hook form
	 */
	const emailError = form.formState.touched.email && form.errors.email?.message
	const passwordError = form.formState.touched.password && form.errors.password?.message

	return {
		form,
		error,
		handleGoogleSubmit,
		handleSubmit,
		handleForgotPassword,
		handleCreateAccount,
		passwordVisible,
		togglePasswordVisibility,
		emailError,
		passwordError,
	}
}