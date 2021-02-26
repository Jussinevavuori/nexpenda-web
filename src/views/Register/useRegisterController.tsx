import ReactGA from "react-ga";
import { useCallback, useState } from 'react';
import { InferType, object, string } from "yup"
import { useStoreActions } from '../../store';
import { useRedirect } from '../../hooks/utils/useRedirect';
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers';

export const registerValidationSchema = object({
	email: string().defined().max(255).email(),
	password: string().defined().min(6).max(255),
}).defined()

export type RegisterFormType = InferType<typeof registerValidationSchema>

export function useRegisterController() {

	const redirect = useRedirect()

	const register = useStoreActions(_ => _.auth.registerWithEmailPassword)

	/**
	 * Submit error
	 */
	const [error, setError] = useState<string>()

	/**
	 * Set to true after succesful registration to display success message
	 */
	const [registered, setRegistered] = useState(false)

	/**
	 * Form state
	 */
	const form = useForm<RegisterFormType>({
		resolver: yupResolver(registerValidationSchema),
	})

	/**
	 * Submit handler
	 */
	async function submitHandler(values: RegisterFormType) {
		setError(undefined)
		const result = await register({ email: values.email, password: values.password })
		if (result.isSuccess()) {
			ReactGA.event({ action: "sign_up", category: "user" })
			setRegistered(true)
		} else {
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
							case "auth/user-already-exists":
								return "An user already exists with that email."
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
		handleSubmit,
		handleLogin,
		error,
		registered,
		passwordVisible,
		togglePasswordVisibility,
		emailError,
		passwordError,
	}
}