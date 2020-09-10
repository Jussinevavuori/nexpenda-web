import React, { useEffect, useState } from "react"
import { ConfirmEmailView } from "./ConfirmEmailView"
import { useParams } from "react-router-dom"
import { useRedirect } from "../../hooks/useRedirect"
import { useStoreActions } from "../../store"

export type ConfirmEmailProps = {

}

export function ConfirmEmail(props: ConfirmEmailProps) {

	const { token } = useParams<{ token?: string }>()

	const redirect = useRedirect()

	const confirmEmail = useStoreActions(_ => _.auth.confirmEmail)

	/**
	 * Boolean for whether confirmation was successful or not: undefined
	 * signals a loading value
	 */
	const [success, setSuccess] = useState<boolean>()

	/**
	 * Initially loading the token validity state from the server
	 */
	useEffect(() => {
		if (token) {
			confirmEmail({ token }).then(result => {
				setSuccess(result.isSuccess())
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

	return <ConfirmEmailView

		success={success}

		onLogin={() => redirect(_ => _.login)}

	/>
}