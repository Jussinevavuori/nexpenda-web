import "./Register.scss"
import React, { useState } from 'react';
import { useForm } from "react-hook-form"
import { registerValidationSchema, RegisterFormType } from './RegisterController';
import { Text } from "../../components/Text/Text";
import { yupResolver } from '@hookform/resolvers';
import { TextField, Button, Divider, InputAdornment, IconButton } from "@material-ui/core";
import {
	Email as EmailIcon,
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";

export type RegisterViewProps = {
	handleSubmit(values: RegisterFormType): Promise<void>;
	handleLogin(): Promise<void>;
}

export const RegisterView: React.FC<RegisterViewProps> = (props) => {

	/**
	 * Password visible state
	 */
	const [passwordVisible, setPasswordVisible] = useState(false)

	/**
	 * React hook form
	 */
	const { register, handleSubmit, errors, formState } = useForm<RegisterFormType>({
		resolver: yupResolver(registerValidationSchema),
	})

	/**
	 * Email and password error shorthands for react hook form
	 */
	const emailError = formState.touched.email && errors.email?.message
	const passwordError = formState.touched.password && errors.password?.message

	return <div className="Register">

		<div className="container">

			<header>

				<Text.Header.H5 weight="bold" color="white">
					{"Create account"}
				</Text.Header.H5>

			</header>

			<div className="content">

				<form noValidate onSubmit={handleSubmit(props.handleSubmit)}>

					<TextField
						id="register-email"
						name="email"
						type="text"
						inputRef={register}
						label="Email"
						variant="outlined"
						error={!!emailError}
						helperText={emailError}
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">
								<EmailIcon />
							</InputAdornment>
						}}
					/>

					<TextField
						id="register-password"
						name="password"
						type={passwordVisible ? "text" : "password"}
						inputRef={register}
						label="Password"
						variant="outlined"
						error={!!passwordError}
						helperText={passwordError}
						fullWidth
						InputProps={{
							endAdornment: <InputAdornment position="end">
								<IconButton onClick={() => setPasswordVisible(_ => !_)} size="small">
									{passwordVisible ? <PasswordVisibleIcon /> : <PasswordInvisibleIcon />}
								</IconButton>
							</InputAdornment>,
						}}
					/>

					<Button
						variant="contained"
						color="primary"
						type="submit"
						fullWidth
					>
						{"Create account"}
					</Button>

				</form >

				<Divider />

				<div className="options">

					<Button onClick={() => props.handleLogin()}>
						{"Already have an account? Login"}
					</Button>

				</div>

			</div>

		</div>

	</div>
}