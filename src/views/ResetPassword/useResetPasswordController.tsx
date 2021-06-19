import ReactGA from "react-ga";
import * as z from "zod";
import { useState } from "react"
import { useStoreActions } from "../../store";
import { useRedirect } from "../../hooks/utils/useRedirect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "../../utils/ErrorMessage/getErrorMessage";

export const resetPasswordValidationSchema = z.object({
	email: z.string().min(3).max(255).email(),
})

export type ResetPasswordFormType = z.TypeOf<typeof resetPasswordValidationSchema>

export function useResetPasswordController() {

	const redirect = useRedirect()

	const resetPassword = useStoreActions(_ => _.auth.resetPassword)
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
	const form = useForm<ResetPasswordFormType>({
		resolver: zodResolver(resetPasswordValidationSchema),
	})

	/**
	 * Submit handler function
	 */
	async function submitHandler(values: ResetPasswordFormType) {
		setError(undefined)
		const result = await resetPassword(values)
		if (result.isSuccess()) {
			ReactGA.event({
				action: "Reset Password",
				category: "User",
			})
			setSuccess(true)
		} else {
			setError(getErrorMessage("resetPassword", result))
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

	const emailError = form.formState.touchedFields.email && form.formState.errors.email?.message

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