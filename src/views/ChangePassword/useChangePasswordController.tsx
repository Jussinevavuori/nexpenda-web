import ReactGA from "react-ga";
import * as z from "zod"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "react-router-dom"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useStoreActions } from "../../store"

export const changePasswordValidationSchema = z.object({
	password: z.string().min(6).max(255),
})
export type ChangePasswordFormType = z.TypeOf<typeof changePasswordValidationSchema>

export function useChangePasswordController() {
	/**
	 * React hook form
	 */
	const form = useForm<ChangePasswordFormType>({
		resolver: zodResolver(changePasswordValidationSchema),
	})

	const { token } = useParams<{ token?: string }>()

	const redirect = useRedirect()

	const validateChangePasswordToken = useStoreActions(_ => _.auth.validateChangePasswordToken)
	const changePassword = useStoreActions(_ => _.auth.changePassword)

	/**
	 * Result from server whether the token is valid: for a valid
	 * token the server will return the user's email, which is stored
	 * here as a string to signal a valid token.
	 * 
	 * We use null to signal an invalid token, when the server responds
	 * with an error and undefined to signal a loading state.
	 */
	const [validTokenEmail, setValidTokenEmail] = useState<string | null | undefined>()

	const [passwordChangeSuccessful, setPasswordChangeSuccessful] = useState(false)

	const [error, setError] = useState<string>()

	/**
	 * Initially loading the token validity state from the server
	 */
	useEffect(() => {
		if (token) {
			validateChangePasswordToken({ token }).then(result => {
				if (result.isSuccess()) {
					setValidTokenEmail(result.value)
				} else {
					setValidTokenEmail(null)
					switch (result.reason) {
						case "invalidServerResponse":
							setError("Could not contact server. Try again later.")
							break;
						case "network":
							switch (result.code) {
								case "request/too-many-requests":
									setError("You are trying too fast. Try again later.	")
									break;
							}
					}
				}
			})
		}
	}, []) // eslint-disable-line

	/**
	 * If no token is present, automatically redirect the user
	 */
	if (!token) {
		redirect(_ => _.login)
	}

	/**
	 * Handle submitting
	 */
	function submitHandler(values: ChangePasswordFormType) {
		if (token) {
			changePassword({ ...values, token }).then(result => {
				if (result.isSuccess()) {
					ReactGA.event({
						action: "Change Password",
						category: "User",
					})

					setPasswordChangeSuccessful(true)
				} else {
					setError("Could not change password")
				}
			})
		}
	}

	const handleSubmit = form.handleSubmit(submitHandler)

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
	const passwordError = form.formState.touchedFields.password && form.formState.errors.password?.message

	return {
		validTokenEmail,
		loading: validTokenEmail === undefined,
		passwordChangeSuccessful,
		handleSubmit,
		handleLogin: () => redirect(_ => _.login),
		error,
		passwordVisible,
		setPasswordVisible,
		togglePasswordVisibility,
		passwordError,
		form
	}
}