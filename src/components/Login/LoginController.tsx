import React from 'react';
import { LoginView } from './LoginView';
import * as yup from "yup"
import { useStoreActions } from '../../store';

export const loginValidationSchema = yup.object({
	email: yup.string().defined().min(3).max(255).email(),
	password: yup.string().defined().min(3).max(255),
}).defined()

export type LoginFormType = yup.InferType<typeof loginValidationSchema>

export const LoginController: React.FC<{}> = () => {

	const logInWithGoogle = useStoreActions(_ => _.authentication.logInWithGoogle)

	async function handleSubmit(values: LoginFormType) {
		console.log("Submitted")
	}

	async function handleGoogleSubmit() {
		logInWithGoogle()
	}

	return <LoginView {...{ handleGoogleSubmit, handleSubmit }} />
}