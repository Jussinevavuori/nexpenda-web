import React, { useState } from 'react';
import { RegisterView } from './RegisterView';
import { InferType, object, string, ref } from "yup"
import { useStoreActions } from '../../store';
import { useRedirect } from '../../hooks/useRedirect';

export const registerValidationSchema = object({
	email: string().defined().max(255).email(),
	password: string().defined().min(5).max(255),
	repeatPassword: string().defined().oneOf([ref("password")], "passwords must match")
}).defined()

export type RegisterFormType = InferType<typeof registerValidationSchema>

export const Register: React.FC<{}> = () => {

	const [error, setError] = useState<string>()

	const redirect = useRedirect()

	const loginWithGoogle = useStoreActions(_ => _.auth.loginWithGoogle)
	const register = useStoreActions(_ => _.auth.registerWithEmailPassword)

	async function handleSubmit(values: RegisterFormType) {
		setError(undefined)
		const result = await register({ email: values.email, password: values.password })
		result.onSuccess(() => redirect(routes => routes.dashboard))
		result.onFailure(failure => {
			switch (failure.code) {
				case "data/invalid-request-data":
					setError("Invalid email or password.")
					break;
				case "auth/user-already-exists":
					setError("An user already exists with that email.")
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

	async function handleGoogleSubmit() {
		loginWithGoogle()
	}

	async function handleLogin() {
		redirect(_ => _.login)
	}

	return <RegisterView {...{
		handleGoogleSubmit,
		handleLogin,
		handleSubmit,
		error
	}} />
}