import "./Register.scss"
import React from 'react';
import { TextField, Button, InputAdornment, IconButton } from "@material-ui/core";
import googleLogo from "../../assets/logos/googleLogo.png"
import {
	Email as EmailIcon,
	Visibility as PasswordVisibleIcon,
	VisibilityOff as PasswordInvisibleIcon,
} from "@material-ui/icons";
import { Type } from "../../components/Type/Type";
import { useRegisterController } from "./useRegisterController";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";


export type RegisterProps = {
}

export function Register() {

	const controller = useRegisterController()
	const isDarkTheme = useIsDarkTheme()

	return <div className="Register">

		<Type
			component="h1"
			variant="bold"
			color={isDarkTheme ? "gray-100" : "gray-900"}
			size="xxl"
		>
			{"Create your new account!"}
		</Type>

		<main>

			<div className="oauthProviders">
				<Button
					variant="outlined"
					onClick={controller.handleGoogleSubmit}
					fullWidth
				>
					<div className="oauthproviderLogo">
						<img src={googleLogo} alt="Google Logo" />
					</div>
					{"Log in with Google"}
				</Button>
			</div>


			{
				controller.registered
					? <>
						<Type size="lg" component="h2" variant="bold">
							{"Succesfully registered."}
						</Type>
						<Type>
							{"Check your email in order to confirm your email address. "}
							{"You can login after having confirmation."}
						</Type>
					</>
					: <form onSubmit={controller.handleSubmit}>

						<TextField
							id="register-email"
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
							id="register-password"
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
									<IconButton onClick={controller.togglePasswordVisibility} size="small">
										{controller.passwordVisible ? <PasswordVisibleIcon /> : <PasswordInvisibleIcon />}
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

						{
							controller.error
								? <Type color="red-600">
									{controller.error}
								</Type>
								: null
						}

					</form >
			}
		</main>

		<footer>
			<Button onClick={controller.handleLogin}>
				{"Already have an account? Login"}
			</Button>
		</footer>

	</div>
}