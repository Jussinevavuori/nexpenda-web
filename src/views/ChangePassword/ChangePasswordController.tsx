import React, { useEffect, useState } from "react"
import { ChangePasswordView } from "./ChangePasswordView"
import { useParams } from "react-router-dom"
import { useRedirect } from "../../hooks/useRedirect"
import * as yup from "yup"
import { useStoreActions } from "../../store"

export const changePasswordValidationSchema = yup.object({
	password: yup.string().defined().min(6).max(255),
}).defined()

export type ChangePasswordFormType = yup.InferType<typeof changePasswordValidationSchema>

export type ChangePasswordProps = {

}

export function ChangePassword(props: ChangePasswordProps) {

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
				result.onSuccess((value) => {
					setValidTokenEmail(value)
				})
				result.onFailure(() => {
					setValidTokenEmail(null)
				})
			})
		}
	}, []) // eslint-disable-line

	/**
	 * If no token is present, automatically redirect the user
	 */
	if (!token) {
		redirect(_ => _.login)
		return null
	}

	/**
	 * Handle submitting
	 */
	function handleSubmit(values: ChangePasswordFormType) {
		if (token) {
			changePassword({ ...values, token }).then(result => {
				result.onSuccess(() => {
					setPasswordChangeSuccessful(true)
				})
				result.onFailure(() => {
					setError("Could not change password")
				})
			})
		}
	}

	return <ChangePasswordView

		validTokenEmail={validTokenEmail}

		loading={validTokenEmail === undefined}

		passwordChangeSuccessful={passwordChangeSuccessful}

		onSubmit={handleSubmit}

		onLogin={() => redirect(_ => _.login)}

		error={error}

	/>
}