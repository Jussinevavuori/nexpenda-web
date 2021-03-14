import "./Login.scss";
import React from 'react';
import { TextField, Button, InputAdornment, IconButton } from "@material-ui/core";
import googleLogo from "../../images/logo_google.png"
import {
	Email as EmailIcon,
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { useLoginController } from "./useLoginController";

export type LoginProps = {
}

export function Login() {
	const controller = useLoginController()

	return <div className="Login">

		<Type
			component="h1"
			variant="bold"
			color="black"
			size="xxl"
		>
			{"Log in"}
		</Type>

		<main>
			<form noValidate onSubmit={controller.handleSubmit}>

				<TextField
					id="login-email"
					name="email"
					type="text"
					inputRef={controller.form.register}
					label="Email"
					variant="outlined"
					error={!!controller.emailError}
					helperText={controller.emailError}
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
					type={controller.passwordVisible ? "text" : "password"}
					inputRef={controller.form.register}
					label="Password"
					variant="outlined"
					error={!!controller.passwordError}
					helperText={controller.passwordError}
					fullWidth
					InputProps={{
						endAdornment: <InputAdornment position="end">
							<IconButton
								onClick={controller.togglePasswordVisibility}
								size="small"
							>
								{
									controller.passwordVisible
										? <PasswordVisibleIcon />
										: <PasswordInvisibleIcon />
								}
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
					{"Log in"}
				</Button>

				{
					controller.error
						? <Type color="red-600">
							{controller.error}
						</Type>
						: null
				}

				<Button
					variant="outlined"
					onClick={controller.handleGoogleSubmit}
					fullWidth
				>
					<div className="authprovider-logo">
						<img src={googleLogo} alt="Google Logo" />
					</div>
					{"Log in with Google"}
				</Button>

			</form>
		</main>

		<footer>
			<Button onClick={controller.handleCreateAccount}>
				{"Create account"}
			</Button>

			<Button onClick={controller.handleForgotPassword}>
				{"Forgot password"}
			</Button>
		</footer>

	</div>
}