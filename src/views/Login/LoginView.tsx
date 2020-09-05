import React from 'react';
import { useForm } from "react-hook-form"
import { loginValidationSchema, LoginFormType } from './LoginController';
import { yupResolver } from '@hookform/resolvers';
import { useStoreActions } from '../../store';

export type LoginViewProps = {
	handleSubmit(values: LoginFormType): Promise<void>;
	handleGoogleSubmit(): Promise<void>;
}

export const LoginView: React.FC<LoginViewProps> = (props) => {

	const { register, handleSubmit, errors, formState } = useForm<LoginFormType>({
		resolver: yupResolver(loginValidationSchema),
	})

	const forgotPassword = useStoreActions(_ => _.auth.forgotPassword)

	const emailError = formState.touched.email && errors.email?.message
	const passwordError = formState.touched.password && errors.password?.message

	return <div className="LoginView">
		<form onSubmit={handleSubmit(props.handleSubmit)}>

			<input id="login-email" name="email" type="text" ref={register} />
			<p style={{ color: "#FF6622" }}>{emailError}</p>

			<input id="login-password" name="password" type="password" ref={register} />
			<p style={{ color: "#FF6622" }}>{passwordError}</p>

			<button type="submit">{"Log in"}</button>

		</form >

		<p>{"or"}</p>

		<form onSubmit={e => { e.preventDefault(); props.handleGoogleSubmit() }}>
			<button type="submit">{"Log in with Google"}</button>
		</form>

		<button onClick={async () => {
			try {
				forgotPassword({ email: "jussi@nevavuori.fi" })
			} catch (error) {
				console.log("Failed with error:", error)
			}
		}}>
			Forgot password?
		</button>
	</div>
}
