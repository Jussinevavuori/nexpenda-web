import React, { useState } from 'react';
import { RegisterView } from './RegisterView';
import { InferType, object, string } from "yup"
import { useStoreActions } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';

export const registerValidationSchema = object({
	email: string().defined().max(255).email(),
	password: string().defined().min(6).max(255),
}).defined()

export type RegisterFormType = InferType<typeof registerValidationSchema>

export const Register: React.FC<{}> = () => {

	const [error, setError] = useState<string>()

	const [registered, setRegistered] = useState(false)

	const redirect = useRedirect()

	const register = useStoreActions(_ => _.auth.registerWithEmailPassword)

	async function handleSubmit(values: RegisterFormType) {
		setError(undefined)
		const result = await register({ email: values.email, password: values.password })
		if (result.isSuccess()) {
			setRegistered(true)
		} else {
			switch (result.reason) {
				case "invalidServerResponse":
					setError("Invalid response received from server.")
					break;
				case "network":
					switch (result.code) {
						case "request/invalid-request-data":
							setError("Invalid email or password.")
							break;
						case "auth/user-already-exists":
							setError("An user already exists with that email.")
							break;
						case "server/unavailable":
							setError("Could not contact server. Try again later.")
							break;
						default:
							console.warn("Uncaught error code in login:", result)
							setError("An error occured while logging in. Try again.")
							break;
					}
					break;
			}
		}
	}

	async function handleLogin() {
		redirect(_ => _.login)
	}

	return <RegisterView
		handleSubmit={handleSubmit}
		handleLogin={handleLogin}
		error={error}
		registered={registered}
	/>
}