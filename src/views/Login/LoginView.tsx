import "./Login.scss";
import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton } from "@material-ui/core";
import googleLogo from "../../images/logo_google.png"
import {
	Email as EmailIcon,
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";
import { AuthFrame } from "../../components/AuthFrame/AuthFrame";
import { Type } from "../../components/Type/Type";
import { LoginFormType } from "./LoginController";
import { useFormContext } from "react-hook-form";

export type LoginViewProps = {
	handleSubmit(values: LoginFormType): Promise<void>;
	handleGoogleSubmit(): Promise<void>;
	handleForgotPassword(): Promise<void>;
	handleCreateAccount(): Promise<void>;
	form: any;
	error?: string;
}

export const LoginView: React.FC<LoginViewProps> = (props) => {
	const form = useFormContext<LoginFormType>()

	/**
	 * Password visible state
	 */
	const [passwordVisible, setPasswordVisible] = useState(false)

	/**
	 * Email and password error shorthands for react hook form
	 */
	const emailError = form.formState.touched.email && form.errors.email?.message
	const passwordError = form.formState.touched.password && form.errors.password?.message

	return <div className="Login">
		<AuthFrame

			header="Login to Expence"

			body={
				<form noValidate onSubmit={form.handleSubmit(props.handleSubmit)}>

					<TextField
						id="login-email"
						name="email"
						type="text"
						inputRef={form.register}
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
						id="login-password"
						name="password"
						type={passwordVisible ? "text" : "password"}
						inputRef={form.register}
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
						{"Login"}
					</Button>

					{
						props.error
							? <Type color="error">
								{props.error}
							</Type>
							: null
					}

					<Button
						variant="outlined"
						onClick={() => props.handleGoogleSubmit()}
						startIcon={<img className="logo" src={googleLogo} alt="Google Logo" />}
						fullWidth
					>
						{"Log in with Google"}
					</Button>

				</form>
			}

			footer={<div className="footerContent">

				<Button onClick={() => props.handleCreateAccount()}>
					{"Create account"}
				</Button>

				<Button onClick={() => props.handleForgotPassword()}>
					{"Forgot password"}
				</Button>

			</div>}
		/>
	</div>
}
