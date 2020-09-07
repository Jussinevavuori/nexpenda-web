import React, { useState } from "react"
import { ForgotPasswordView } from "./ForgotPasswordView"
import * as yup from "yup";
import { useStoreActions } from "../../store";
import { useRedirect } from "../../hooks/useRedirect";

export const forgotPasswordValidationSchema = yup.object({
	email: yup.string().defined().min(3).max(255).email(),
}).defined()

export type ForgotPasswordFormType = yup.InferType<typeof forgotPasswordValidationSchema>

export type ForgotPasswordProps = {

}

export function ForgotPassword(props: ForgotPasswordProps) {

	const [error, setError] = useState<string>()

	const [success, setSuccess] = useState<boolean>(false)

	const redirect = useRedirect()

	const forgotPassword = useStoreActions(_ => _.auth.forgotPassword)
	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)

	async function handleSubmit(values: ForgotPasswordFormType) {
		setError(undefined)
		const result = await forgotPassword(values)
		result.onSuccess(() => setSuccess(true))
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

	async function handleLogin() {
		redirect(_ => _.login)
	}

	async function handleCreateAccount() {
		redirect(_ => _.register)
	}

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	return <ForgotPasswordView {...{
		handleSubmit,
		handleCreateAccount,
		handleGoogleSubmit,
		handleLogin,
		success,
		error
	}} />
}