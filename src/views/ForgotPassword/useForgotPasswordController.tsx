import { useState } from "react"
import * as yup from "yup";
import { useStoreActions } from "../../store";
import { useRedirect } from "../../hooks/useRedirect";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";

export const forgotPasswordValidationSchema = yup.object({
	email: yup.string().defined().min(3).max(255).email(),
}).defined()

export type ForgotPasswordFormType = yup.InferType<typeof forgotPasswordValidationSchema>

export function useForgotPasswordController() {

	const redirect = useRedirect()

	const forgotPassword = useStoreActions(_ => _.auth.forgotPassword)
	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)

	/**
	 * Submit error state
	 */
	const [error, setError] = useState<string>()

	/**
	 * Was password forget send succesful
	 */
	const [success, setSuccess] = useState<boolean>(false)

	/**
	 * Form state
	 */
	const form = useForm<ForgotPasswordFormType>({
		resolver: yupResolver(forgotPasswordValidationSchema),
	})

	/**
	 * Submit handler function
	 */
	async function submitHandler(values: ForgotPasswordFormType) {
		setError(undefined)
		const result = await forgotPassword(values)
		if (result.isSuccess()) {
			setSuccess(true)
		} else {
			setError(() => {
				switch (result.reason) {
					case "invalidServerResponse":
						return "Invalid response received from server."
					case "network":
						switch (result.code) {
							case "request/invalid-request-data":
								return "Invalid email or password."
							case "request/too-many-requests":
								return "You are trying too fast! Try again later."
							case "auth/invalid-credentials":
								return "Wrong password or the user does not have a password."
							case "auth/user-not-found":
								return "No user exists with that email."
							case "server/unavailable":
								return "Could not contact server. Try again later."
							default:
								console.warn("Uncaught error code in login:", result)
								return "An error occured while logging in. Try again."
						}
				}
			})
		}
	}

	const handleSubmit = form.handleSubmit(submitHandler)

	async function handleLogin() {
		redirect(_ => _.login)
	}

	async function handleCreateAccount() {
		redirect(_ => _.register)
	}

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	const emailError = form.formState.touched.email && form.errors.email?.message

	return {
		handleSubmit,
		handleCreateAccount,
		handleGoogleSubmit,
		handleLogin,
		success,
		error,
		emailError,
		form
	}
}