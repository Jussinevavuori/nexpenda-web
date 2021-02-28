import ReactGA from "react-ga";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useRedirect } from "../../hooks/utils/useRedirect"
import { useStoreActions } from "../../store"

export function useConfirmEmailController() {

	const { token } = useParams<{ token?: string }>()

	const redirect = useRedirect()

	const confirmEmail = useStoreActions(_ => _.auth.confirmEmail)

	/**
	 * Boolean for whether confirmation was successful or not: undefined
	 * signals a loading value
	 */
	const [success, setSuccess] = useState<boolean>()

	const [error, setError] = useState<string | null>(null)

	/**
	 * Initially loading the token validity state from the server
	 */
	useEffect(() => {
		if (token) {
			confirmEmail({ token }).then(result => {
				setSuccess(result.isSuccess())
				if (result.isSuccess()) {
					ReactGA.event({
						action: "Confirm Email",
						category: "User",
					})
				} else {
					switch (result.reason) {
						case "invalidServerResponse":
							setError("Could not contact server. Try again later.")
							break;
						case "network":
							switch (result.code) {
								case "request/too-many-requests":
									setError("You are trying too fast. Try again later.")
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

	const handleLogin = () => redirect(_ => _.login)

	return {
		success,
		handleLogin,
		error,
	}
}