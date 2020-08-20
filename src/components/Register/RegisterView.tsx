import React from 'react';
import { useForm } from "react-hook-form"
import { registerValidationSchema, RegisterFormType } from './RegisterController';
import { yupResolver } from '@hookform/resolvers';

export type RegisterViewProps = {
	handleSubmit(values: RegisterFormType): Promise<void>;
}

export const RegisterView: React.FC<RegisterViewProps> = (props) => {

	const { register, handleSubmit, errors, formState } = useForm<RegisterFormType>({
		resolver: yupResolver(registerValidationSchema),

	})

	const emailError = formState.touched.email && errors.email?.message
	const passwordError = formState.touched.password && errors.password?.message
	const repeatPasswordError = formState.touched.repeatPassword && errors.repeatPassword?.message

	return <form onSubmit={handleSubmit(props.handleSubmit)}>

		<input id="register-email" name="email" type="text" ref={register} />
		<p style={{ color: "#FF6622" }}>{emailError}</p>

		<input id="register-password" name="password" type="password" ref={register} />
		<p style={{ color: "#FF6622" }}>{passwordError}</p>

		<input id="register-repeat-password" name="repeatPassword" type="password" ref={register} />
		<p style={{ color: "#FF6622" }}>{repeatPasswordError}</p>

		<button type="submit">{"Register"}</button>

	</form >
}